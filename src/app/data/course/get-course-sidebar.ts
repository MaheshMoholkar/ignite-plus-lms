import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function getCourseSidebarData(slug: string) {
  const session = await requireUser();

  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      fileKey: true,
      level: true,
      category: true,
      slug: true,
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lessonProgress: {
                where: {
                  userId: session.id,
                },
                select: {
                  completed: true,
                  lessonId: true,
                  id: true,
                },
              },
            },
            orderBy: { position: "asc" },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId: course.id,
      },
    },
    select: {
      status: true,
    },
  });

  if (!enrollment || enrollment.status !== "ACTIVE") return notFound();

  return course;
}

export type CourseSidebarType = Awaited<
  ReturnType<typeof getCourseSidebarData>
>;
