import { GetEnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-contruct-url";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Progress } from "@/components/ui/progress";

function CourseProgressCard({ course }: GetEnrolledCourseType) {
  const thumbnailUrl = useConstructUrl(course.fileKey);

  // Calculate progress
  const totalLessons = course.chapters.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0
  );
  const completedLessons = course.chapters.reduce(
    (total, chapter) =>
      total +
      chapter.lessons.filter((lesson) =>
        lesson.lessonProgress.find(
          (progress) => progress.lessonId === lesson.id && progress.completed
        )
      ).length,
    0
  );
  const percentCompleted =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{course.level}</Badge>
      <Image
        src={thumbnailUrl}
        alt="Thumbnail"
        width={600}
        height={400}
        className="w-full rounded-t-xl aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link href={`/dashboard/${course.slug}`}>
          <h3 className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors">
            {course.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight">
          {course.smallDescription}
        </p>
        <div className="space-y-4 mt-5">
          <div className="space-y-2">
            <p className="text-sm font-medium">Progress:</p>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">
                {completedLessons}/{totalLessons} lessons
              </span>
              <span className="font-medium">{percentCompleted}%</span>
            </div>
            <Progress value={percentCompleted} className="h-1.5" />
          </div>
        </div>

        <Link
          href={`/dashboard/${course.slug}`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Go to Course
        </Link>
      </CardContent>
    </Card>
  );
}

export default CourseProgressCard;

export function CourseProgressCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        <Skeleton className="mt-4 w-full h-10 rounded-md" />
      </CardContent>
    </Card>
  );
}
