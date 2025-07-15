import React, { ReactNode } from "react";
import CourseSidebar from "../_components/CourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar";

async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const course = await getCourseSidebarData(params.slug);
  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <div className="w-80 border-r border-border shrink-0">
        <CourseSidebar course={course} />
      </div>
      {/* Main */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export default Layout;
