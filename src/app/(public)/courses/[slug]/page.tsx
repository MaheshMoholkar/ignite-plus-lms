import { getCourseBySlug } from "@/app/data/course/get-course-by-slug";
import CourseDetails from "./_components/CourseDetails";
import { getEnrollmentStatus } from "./actions";

async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  const enrollmentStatus = await getEnrollmentStatus(course.id);

  return <CourseDetails course={course} enrollmentStatus={enrollmentStatus} />;
}

export default CoursePage;
