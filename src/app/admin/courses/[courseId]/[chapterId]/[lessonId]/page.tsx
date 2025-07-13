import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
import React from "react";
import LessonForm from "./_components/LessonForm";

async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string; lessonId: string }>;
}) {
  const { lessonId, chapterId, courseId } = await params;
  const lesson = await adminGetLesson(lessonId);
  return (
    <LessonForm lesson={lesson} chapterId={chapterId} courseId={courseId} />
  );
}

export default LessonPage;
