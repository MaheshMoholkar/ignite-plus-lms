import { getLessonContent } from "@/app/data/course/get-lesson-content";
import CourseContent from "./_components/CourseContent";
import React from "react";

async function LessonSlug({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = await getLessonContent(lessonId);
  return <CourseContent lesson={lesson} />;
}

export default LessonSlug;
