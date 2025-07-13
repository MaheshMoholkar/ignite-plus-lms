import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "./_components/AdminCourseCard";
import { EmptyState } from "@/components/common/EmptyState";

export default function CoursesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          <PlusIcon className="w-4 h-4" />
          Create Course
        </Link>
      </div>
      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  const courses = await adminGetCourses();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
      {courses.length > 0 ? (
        courses.map((course) => <AdminCourseCard key={course.id} {...course} />)
      ) : (
        <EmptyState
          title={"No Courses"}
          description={"Create a new course to get started"}
          buttonText={"Create Course"}
          href={"/admin/courses/create"}
        />
      )}
    </div>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
