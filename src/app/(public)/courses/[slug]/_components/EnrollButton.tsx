"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { env } from "@/env";
import { enrollInCourseAction } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface EnrollButtonProps {
  courseId: string;
  coursePrice: number;
  courseTitle: string;
  courseSlug: string;
  enrollmentStatus: "ACTIVE" | "PENDING" | null;
}

export default function EnrollButton({
  courseId,
  coursePrice,
  courseTitle,
  courseSlug,
  enrollmentStatus,
}: EnrollButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollInCourseAction(courseId)
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      if (result.status === "success" && result.data) {
        try {
          await initializeRazorpay();
          openRazorpayCheckout(result.data, courseTitle);
        } catch (error) {
          toast.error("Failed to open payment gateway. Please try again.");
        }
      }
    });
  };

  const initializeRazorpay = async (): Promise<void> => {
    if (window.Razorpay) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));

      document.head.appendChild(script);
    });
  };

  const openRazorpayCheckout = (orderData: any, courseTitle: string) => {
    const options = {
      key: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: coursePrice * 100,
      currency: "INR",
      name: "Ignite Plus LMS",
      description: courseTitle,
      order_id: orderData.orderId,
      handler: function (response: any) {
        toast.success(
          "Payment successful! Your enrollment is being processed."
        );
      },
      prefill: {
        name: "",
        email: "",
      },
      theme: {
        color: "#3B82F6",
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment modal closed");
        },
      },
      notes: {
        courseId: courseId,
        courseTitle: courseTitle,
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (enrollmentStatus === "ACTIVE") {
    return (
      <Link href={`/courses/${courseSlug}/content`}>
        <Button className="w-full" variant="default">
          Go to Course
        </Button>
      </Link>
    );
  }

  if (enrollmentStatus === "PENDING") {
    return (
      <div className="flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-full" disabled>
                Enrollment Pending
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>
                Your payment is being processed. If you have completed payment
                and still see this, please wait a few minutes or retry.
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          className="w-full"
          variant="outline"
          onClick={handleEnroll}
          disabled={isPending}
        >
          {isPending ? "Retrying..." : "Retry Payment"}
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleEnroll} disabled={isPending} className="w-full">
      {isPending ? "Processing..." : "Enroll Now"}
    </Button>
  );
}
