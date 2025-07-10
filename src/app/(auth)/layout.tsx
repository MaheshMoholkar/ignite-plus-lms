import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeft className="size-4" /> Back
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 self-center font-medium"
        >
          <svg
            role="img"
            viewBox="0 0 32 32"
            width={32}
            height={32}
            className="text-orange-500 dark:text-orange-400 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Ignite+ LMS</title>
            {/* Main flame/ignite symbol */}
            <path d="M16 4C12.5 4 10 6.5 10 10C10 12 11 14 12 16C13 18 14 20 16 22C18 20 19 18 20 16C21 14 22 12 22 10C22 6.5 19.5 4 16 4Z" />
            <path d="M16 6C18.2 6 20 7.8 20 10C20 11.5 19.2 13 18.5 14.5C17.8 16 17 17.5 16 19C15 17.5 14.2 16 13.5 14.5C12.8 13 12 11.5 12 10C12 7.8 13.8 6 16 6Z" />

            {/* Plus symbol in top right */}
            <rect x="22" y="2" width="2" height="6" rx="1" />
            <rect x="20" y="4" width="6" height="2" rx="1" />

            {/* Sparkle effects */}
            <circle cx="8" cy="8" r="1" opacity="0.6" />
            <circle cx="24" cy="12" r="0.8" opacity="0.4" />
            <circle cx="6" cy="20" r="0.6" opacity="0.5" />
          </svg>{" "}
          <span className="text-2xl font-bold">IGNITE+ LMS</span>
        </Link>
        <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
        <div className="text-sm text-balance text-center text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <span className="hover:text-primary underline cursor-pointer">
            Terms of service
          </span>{" "}
          and{" "}
          <span className="hover:text-primary underline cursor-pointer">
            Privacy Policy
          </span>
        </div>
      </div>
    </div>
  );
}
