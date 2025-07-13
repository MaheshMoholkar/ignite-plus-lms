import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function adminGetLesson(lessonId: string) {
  await requireAdmin();

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
    },
  });

  if (!lesson) {
    notFound();
  }

  return lesson;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
