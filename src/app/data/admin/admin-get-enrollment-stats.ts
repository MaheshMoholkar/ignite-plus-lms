import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./require-admin";

export async function adminGetEnrollmentStats() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Create date map for counting enrollments
  const enrollmentCounts = new Map<string, number>();

  // Initialize all 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    enrollmentCounts.set(dateKey, 0);
  }

  // Count enrollments by date
  for (const enrollment of enrollments) {
    const dateKey = enrollment.createdAt.toISOString().split("T")[0];
    enrollmentCounts.set(dateKey, (enrollmentCounts.get(dateKey) || 0) + 1);
  }

  // Convert to array format
  const last30Days = Array.from(enrollmentCounts.entries()).map(
    ([date, enrollments]) => ({
      date,
      enrollments,
    })
  );

  return last30Days;
}
