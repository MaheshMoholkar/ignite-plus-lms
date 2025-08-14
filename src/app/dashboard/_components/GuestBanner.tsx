"use client";

import React, { useEffect, useState } from "react";

function GuestBanner() {
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
  if (!isGuest) return null;
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <p className="text-blue-800 text-sm font-medium">
          You are currently accessing as a Guest User.
        </p>
      </div>
      <p className="text-blue-700 text-sm mt-1">
        This is a demo account for recruiters to explore the project features.
      </p>
    </div>
  );
}

export default GuestBanner;
