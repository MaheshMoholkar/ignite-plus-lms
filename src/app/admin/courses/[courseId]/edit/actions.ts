"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchemas";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { revalidatePath } from "next/cache";

export async function UpdateCourse(
  courseId: string,
  data: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const validation = courseSchema.safeParse(data);
    if (!validation.success) {
      return {
        status: "error",
        message: validation.error.message,
      };
    }

    const course = await prisma.course.update({
      where: { id: courseId, userId: session.user.id },
      data: validation.data,
    });

    return {
      status: "success",
      message: "Course updated successfully",
      data: course,
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}

export async function UpdateCourseLessons(
  chapterId: string,
  courseId: string,
  lessons: { id: string; position: number }[]
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons to update",
      };
    }
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reordered lessons",
    };
  }
}

export async function UpdateCourseChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters to update",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: { id: chapter.id, courseId: courseId },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}

export async function CreateChapter(
  data: ChapterSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const validation = chapterSchema.safeParse(data);
    if (!validation.success) {
      return {
        status: "error",
        message: validation.error.message,
      };
    }

    const latestPosition = await prisma.$transaction(async (tx) => {
      const chapter = await tx.chapter.findFirst({
        where: {
          courseId: data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
        take: 1,
      });

      return (chapter?.position ?? 0) + 1;
    });

    await prisma.chapter.create({
      data: {
        ...validation.data,
        position: latestPosition,
      },
    });

    revalidatePath(`/admin/courses/${data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
}

export async function CreateLesson(
  data: LessonSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const validation = lessonSchema.safeParse(data);
    if (!validation.success) {
      return {
        status: "error",
        message: validation.error.message,
      };
    }

    const latestPosition = await prisma.$transaction(async (tx) => {
      const lesson = await tx.lesson.findFirst({
        where: {
          chapterId: data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
        take: 1,
      });

      return (lesson?.position ?? 0) + 1;
    });

    await prisma.lesson.create({
      data: {
        title: validation.data.title,
        chapterId: validation.data.chapterId,
        description: validation.data.description,
        thumbnailKey: validation.data.thumbnailKey,
        videoKey: validation.data.videoKey,
        position: latestPosition,
      },
    });

    revalidatePath(`/admin/courses/${data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create lesson",
    };
  }
}

export async function DeleteLesson(
  lessonId: string,
  courseId: string,
  chapterId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        lessons: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!chapterWithLessons) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    const lessons = chapterWithLessons.lessons;

    const lessonsToDelete = lessons.find((lesson) => lesson.id === lessonId);

    if (!lessonsToDelete) {
      return {
        status: "error",
        message: "Lesson not found",
      };
    }

    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updates = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: { id: lessonId, chapterId: chapterId },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete lesson",
    };
  }
}

export async function DeleteChapter(
  chapterId: string,
  courseId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const courseWithChapters = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        chapters: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!courseWithChapters) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    const chapters = courseWithChapters.chapters;

    const chapterToDelete = chapters.find(
      (chapter) => chapter.id === chapterId
    );

    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    const remainingChapters = chapters.filter(
      (chapter) => chapter.id !== chapterId
    );

    const updates = remainingChapters.map((chapter, index) => {
      return prisma.chapter.update({
        where: { id: chapter.id },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where: { id: chapterId, courseId: courseId },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
}
