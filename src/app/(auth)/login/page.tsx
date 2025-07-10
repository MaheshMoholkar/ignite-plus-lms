import { redirect } from "next/navigation";
import LoginForm from "./_components/LoginForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function Login() {
  "use server";
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/");
  }
  return <LoginForm />;
}

export default Login;
