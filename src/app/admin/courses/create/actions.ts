"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function CreateCourse(
  data: CourseSchemaType
): Promise<ApiResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return {
        status: "error",
        message: "Unauthorized",
      };
    }

    const validation = courseSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        message: validation.error.message,
      };
    }

    const course = await prisma.course.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
      data: course,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong",
      error: error as string,
    };
  }
}
