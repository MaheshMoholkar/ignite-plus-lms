"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import Razorpay from "razorpay";
import { env } from "@/env";
import { convertPriceForRazorpay } from "@/lib/razorpay";
import { z } from "zod";

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

const enrollSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});

export async function enrollInCourseAction(
  courseId: string
): Promise<ApiResponse> {
  const validation = enrollSchema.safeParse({ courseId });
  if (!validation.success) {
    return {
      status: "error",
      message: "Invalid course ID",
    };
  }

  const user = await requireUser();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({
        where: {
          id: courseId,
          status: "PUBLISHED",
        },
        select: {
          id: true,
          title: true,
          price: true,
          slug: true,
          status: true,
        },
      });

      if (!course) {
        return {
          status: "error",
          message: "Course not found or not available for enrollment",
        };
      }

      // Check for ACTIVE enrollment
      const activeEnrollment = await tx.enrollment.findFirst({
        where: {
          userId: user.id,
          courseId: courseId,
          status: "ACTIVE",
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (activeEnrollment) {
        return {
          status: "error",
          message: "Already enrolled in this course",
        };
      }

      // Check for PENDING enrollment (retry logic)
      const pendingEnrollment = await tx.enrollment.findFirst({
        where: {
          userId: user.id,
          courseId: courseId,
          status: "PENDING",
        },
        select: {
          id: true,
          status: true,
          razorpayOrderId: true,
          amount: true,
        },
      });

      if (pendingEnrollment) {
        // Try to fetch the existing Razorpay order details (optional, but we can just return the orderId)
        return {
          status: "success",
          message: "Order already created. Reusing existing order.",
          data: {
            orderId: pendingEnrollment.razorpayOrderId,
            amount: pendingEnrollment.amount,
            currency: "INR",
            courseTitle: course.title,
          },
        };
      }

      // No PENDING or ACTIVE enrollment, create new order/enrollment
      const razorpayAmount = convertPriceForRazorpay(course.price, "INR");
      const receipt = `course_${courseId}_${user.id}_${Date.now()}`.slice(
        0,
        40
      );

      let order;
      try {
        order = await razorpay.orders.create({
          amount: razorpayAmount,
          currency: "INR",
          receipt: receipt,
          notes: {
            courseId: course.id,
            courseTitle: course.title,
            userId: user.id,
            userEmail: user.email,
          },
        });
      } catch (err) {
        return {
          status: "error",
          message: "Payment gateway error. Please try again.",
          error: err,
        };
      }

      await tx.enrollment.create({
        data: {
          userId: user.id,
          courseId: courseId,
          amount: course.price,
          status: "PENDING",
          razorpayOrderId: order.id,
          expectedAmount: razorpayAmount,
        },
      });

      return {
        status: "success",
        message: "Order created successfully",
        data: {
          orderId: order.id,
          amount: course.price,
          currency: "INR",
          courseTitle: course.title,
        },
      };
    });

    if (
      result &&
      typeof result === "object" &&
      "status" in result &&
      result.status === "error"
    ) {
      return result as ApiResponse;
    }

    return result as ApiResponse;
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create enrollment. Please try again.",
      error: error as string,
    };
  }
}

export async function getEnrollmentStatus(
  courseId: string
): Promise<"ACTIVE" | "PENDING" | null> {
  const user = await requireUser();
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: user.id,
      courseId,
    },
    select: {
      status: true,
    },
  });
  if (!enrollment) return null;
  if (enrollment.status === "ACTIVE" || enrollment.status === "PENDING") {
    return enrollment.status;
  }
  return null;
}
