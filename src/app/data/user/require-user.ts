import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function requireUser() {
  // First try to get regular session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return session.user;
  }

  const cookieStore = await cookies();
  const guestAccess = cookieStore.get("guest-access");

  if (guestAccess || process.env.NODE_ENV === "development") {
    return {
      id: "guest_user_id_exact_copy",
      name: "John Doe",
      email: "john.doe@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date("2025-07-11T18:38:48.808Z"),
      updatedAt: new Date("2025-07-11T18:38:48.808Z"),
      role: "user",
      banned: null,
      banReason: null,
      banExpires: null,
    };
  }

  return redirect("/login");
}
