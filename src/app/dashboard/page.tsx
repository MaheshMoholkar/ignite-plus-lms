import { EmptyState } from "@/components/common/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import {
  getEnrolledCourses,
  GetEnrolledCourseType,
} from "../data/user/get-enrolled-courses";
import PublicCourseCard from "../(public)/_components/PublicCourseCard";
import CourseProgressCard from "./_components/CourseProgressCard";
import GuestBanner from "./_components/GuestBanner";

export default async function Page() {
  const [allCourses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  return (
    <>
      <GuestBanner />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold mb-4">Enrolled Courses</h1>
        <p className="text-muted-foreground mb-4">
          You are enrolled in {enrolledCourses.length} courses.
        </p>
        {enrolledCourses.length === 0 ? (
          <EmptyState
            title="No courses purchased"
            description="You haven't purchased any courses yet."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((enroll: GetEnrolledCourseType, index) => (
              <CourseProgressCard key={index} course={enroll.course} />
            ))}
          </div>
        )}
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">
            Available courses to purchase.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          {allCourses.filter(
            (course) =>
              !enrolledCourses.some(
                ({ course: enrolled }) => enrolled.id === course.id
              )
          ).length === 0 ? (
            <EmptyState
              title="No available courses"
              description="All courses have been purchased."
              buttonText="Browse Courses"
              href="/courses"
            />
          ) : (
            <div>
              {allCourses
                .filter(
                  (course) =>
                    !enrolledCourses.some(
                      ({ course: enrolled }) => enrolled.id === course.id
                    )
                )
                .map((course) => (
                  <PublicCourseCard key={course.id} course={course} />
                ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
