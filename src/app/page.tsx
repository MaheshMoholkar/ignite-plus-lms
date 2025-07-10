"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/");
          toast.success("Signed out");
        },
        onError: () => {
          toast.error("Failed to sign out");
        },
      },
    });
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ThemeToggle />
      {session ? (
        <div>
          <h1>Welcome {session.user.name}</h1>
          <Button onClick={handleLogout}>Log out</Button>
        </div>
      ) : isPending ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Button onClick={() => router.push("/login")}>Login</Button>
        </div>
      )}
    </div>
  );
}
