import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/env";
import crypto from "crypto";

// Webhook event types
type WebhookEvent = {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        status: string;
        amount: number;
        currency: string;
        email: string;
        contact: string;
        created_at: number;
      };
    };
  };
  created_at: number;
};

// Only handle POST requests
export async function POST(request: NextRequest) {
  const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Razorpay sends raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Parse event
  let event: WebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await handleWebhookEvent(event);
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleWebhookEvent(event: WebhookEvent) {
  const {
    order_id: orderId,
    id: paymentId,
    amount: paidAmount,
  } = event.payload.payment.entity;

  switch (event.event) {
    case "payment.captured":
      await handlePaymentCaptured(orderId, paymentId, paidAmount);
      break;
    case "payment.failed":
      await handlePaymentFailed(orderId);
      break;
    case "refund.processed":
      await handleRefundProcessed(orderId);
      break;
    default:
      // Unhandled event, do nothing
      break;
  }
}

async function handlePaymentCaptured(
  orderId: string,
  paymentId: string,
  paidAmount: number
) {
  try {
    // Fetch the enrollment by orderId
    const enrollment = await prisma.enrollment.findUnique({
      where: { razorpayOrderId: orderId },
    });
    if (!enrollment) return;

    // Compare paid amount with expectedAmount
    if (enrollment.expectedAmount !== paidAmount) {
      //TODO: Optionally, log or handle the mismatch
      // Do not activate enrollment if amounts do not match
      return;
    }

    await prisma.enrollment.update({
      where: {
        razorpayOrderId: orderId,
      },
      data: {
        status: "ACTIVE",
        razorpayPaymentId: paymentId,
      },
    });
  } catch {}
}

async function handlePaymentFailed(orderId: string) {
  try {
    await prisma.enrollment.update({
      where: {
        razorpayOrderId: orderId,
      },
      data: {
        status: "CANCELLED",
      },
    });
  } catch {}
}

async function handleRefundProcessed(orderId: string) {
  try {
    await prisma.enrollment.update({
      where: { razorpayOrderId: orderId },
      data: { status: "REFUNDED" },
    });
  } catch {}
}
