import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./require-admin";

export async function adminGetDashboardStats() {
  await requireAdmin();

  const [users, enrollments, courses, lessons] = await Promise.all([
    prisma.user.count(),
    prisma.enrollment.count({
      where: {
        status: "ACTIVE",
      },
    }),
    prisma.course.count(),
    prisma.lesson.count(),
  ]);

  return {
    users,
    enrollments,
    courses,
    lessons,
  };
}
