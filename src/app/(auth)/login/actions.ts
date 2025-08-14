"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAsGuest() {
  // Set a guest access cookie to identify guest users
  const cookieStore = await cookies();
  cookieStore.set("guest-access", "true", {
    httpOnly: false, // Allow JavaScript to access this cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
  });

  // Redirect to dashboard with guest parameter
  redirect("/dashboard?guest=true");
}
