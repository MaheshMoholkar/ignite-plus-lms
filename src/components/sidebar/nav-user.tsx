"use client";

import { IconDotsVertical, IconLogout, IconUser } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { useSignOut } from "@/hooks/use-signout";
import { useEffect, useState } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const handleSignOut = useSignOut();
  const { data: session } = authClient.useSession();
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

  const userName = isGuest ? "John Doe" : session?.user?.name;
  const userEmail = isGuest ? "john.doe@example.com" : session?.user?.email;
  const userImage = isGuest ? null : session?.user?.image;

  const handleGuestLogout = () => {
    document.cookie =
      "guest-access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.reload();
    window.location.href = "/";
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={userImage || `https://avatar.vercel.sh/${userEmail}`}
                  alt={userName || ""}
                />
                <AvatarFallback className="rounded-lg">
                  {isGuest ? <IconUser size={16} /> : userEmail?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {isGuest ? "Guest User" : userEmail}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userImage || ""} alt={userName || ""} />
                  <AvatarFallback className="rounded-lg">
                    {isGuest ? <IconUser size={16} /> : userEmail?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {isGuest ? "Guest User" : userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/">
                  <HomeIcon />
                  Homepage
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={isGuest ? handleGuestLogout : handleSignOut}
            >
              <IconLogout />
              {isGuest ? "Exit Guest Mode" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
