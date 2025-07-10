"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [emailPending, startEmailTransition] = useTransition();
  const [code, setCode] = useState("");

  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;

  const handleVerify = async () => {
    startEmailTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: code,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified");
            router.replace("/");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription>
          We have sent a verification code to your email address. Please open
          the email and paste the code below.
        </CardDescription>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <InputOTP
              maxLength={6}
              className="gap-2"
              value={code}
              onChange={(value) => setCode(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to your email.
            </p>
          </div>
          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={emailPending || code.length !== 6}
          >
            {emailPending ? "Verifying..." : "Verify Email"}
          </Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
