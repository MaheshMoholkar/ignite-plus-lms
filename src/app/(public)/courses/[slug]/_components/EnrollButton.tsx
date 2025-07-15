"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { env } from "@/env";
import { enrollInCourseAction } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition, useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { convertPriceForRazorpay } from "@/lib/razorpay";
import { useConfetti } from "@/hooks/use-confetti";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const [isModalCancelled, setIsModalCancelled] = useState(false);
  const router = useRouter();
  const { triggerConfetti } = useConfetti();

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
        } catch {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openRazorpayCheckout = (orderData: any, courseTitle: string) => {
    const options = {
      key: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: convertPriceForRazorpay(coursePrice, "INR"),
      currency: "INR",
      name: "Ignite Plus LMS",
      description: courseTitle,
      order_id: orderData.orderId,
      handler: function () {
        toast.success(
          "Payment successful! Your enrollment is being processed."
        );
        triggerConfetti();
        router.refresh();
      },
      prefill: {
        name: "",
        email: "",
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled");
          router.refresh();
          setIsModalCancelled(true);
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
      <Link href={`/dashboard/${courseSlug}`}>
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
              <Button variant="outline" className="w-full">
                {isModalCancelled ? "Payment Cancelled" : "Enrollment Pending"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>
                {isModalCancelled
                  ? "Your payment was cancelled. Click retry to attempt payment again."
                  : "Your payment is being processed. If you have completed payment and still see this, please wait a few minutes or retry."}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button className="w-full" onClick={handleEnroll} disabled={isPending}>
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
