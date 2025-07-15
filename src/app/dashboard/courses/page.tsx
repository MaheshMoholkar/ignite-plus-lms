import React from "react";
import { EmptyState } from "@/components/common/EmptyState";
import {
  getEnrolledCourses,
  GetEnrolledCourseType,
} from "../../data/user/get-enrolled-courses";
import CourseProgressCard from "../_components/CourseProgressCard";

export default async function CoursesPage() {
  const enrolledCourses = await getEnrolledCourses();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Courses</h1>
      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No courses purchased"
          description="You haven't purchased any courses yet."
          buttonText="Browse Courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolledCourses.map(
            (enroll: GetEnrolledCourseType, index: number) => (
              <CourseProgressCard key={index} course={enroll.course} />
            )
          )}
        </div>
      )}
    </div>
  );
}
