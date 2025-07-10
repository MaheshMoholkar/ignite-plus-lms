import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GithubIcon } from "lucide-react";
import React from "react";

function Login() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full ">
          <GithubIcon className="size-4" />
          Continue with Github
        </Button>
      </CardContent>
    </Card>
  );
}

export default Login;
