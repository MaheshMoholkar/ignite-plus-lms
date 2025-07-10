import React from "react";
import Navbar from "./_components/Navbar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="container px-4 md:px-6 lg:px-8 mx-auto">{children}</main>
    </div>
  );
}

export default Layout;
