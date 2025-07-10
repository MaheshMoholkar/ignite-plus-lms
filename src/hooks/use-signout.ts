"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignOut = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Logged out successfully");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    });
  };

  return handleSignOut;
};
