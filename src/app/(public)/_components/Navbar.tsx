"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/public/logo.svg";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import UserDropdown from "./UserDropdown";

const navigationItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Courses",
    href: "/courses",
  },
  {
    label: "About",
    href: "/about",
  },
];

function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const checkGuestAccess = () => {
      const cookies = document.cookie.split(";");
      const guestCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("guest-access=")
      );
      setIsGuest(!!guestCookie);
    };

    checkGuestAccess();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={logo} alt="logo" className="size-9" />
          <span className="font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Ignite+ LMS
          </span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center">
          <div className="flex items-center space-x-12">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="flex items-center space-x-4 ml-auto md:ml-0">
          <ThemeToggle />
          {isPending ? null : session ? (
            <UserDropdown
              name={session.user.name}
              email={session.user.email}
              image={session.user.image}
            />
          ) : isGuest ? (
            <UserDropdown
              name="John Doe"
              email="john.doe@example.com"
              image={null}
            />
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "secondary",
                })}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
