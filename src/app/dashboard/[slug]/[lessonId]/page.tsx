import { getLessonContent } from "@/app/data/course/get-lesson-content";
import React from "react";

async function LessonSlug({ params }: { params: { lessonId: string } }) {
  const lesson = await getLessonContent(params.lessonId);
  return <div>{lesson.title}</div>;
}

export default LessonSlug;
