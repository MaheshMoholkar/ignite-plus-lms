"use client";

import { CourseSidebarType } from "@/app/data/course/get-course-sidebar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { courseCategoryLabels } from "@/lib/zodSchemas";
import { ChevronDown, Play } from "lucide-react";
import React from "react";
import LessonItem from "./LessonItem";
import { usePathname } from "next/navigation";

function CourseSidebar({ course }: { course: CourseSidebarType }) {
  const pathname = usePathname();

  const isActive = (lessonId: string) => {
    return pathname.includes(lessonId);
  };

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
    <div className="flex flex-col h-full">
      <div className="pb-4 pr-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink">
            <Play className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {courseCategoryLabels[course.category]}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <Progress value={percentCompleted} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {percentCompleted}% completed
          </p>
        </div>
      </div>
      <div className="py-4 pr-4 space-y-3">
        {course.chapters.map((chapter, index) => {
          const chapterCompleted =
            chapter.lessons.length > 0 &&
            chapter.lessons.every((lesson) =>
              lesson.lessonProgress.find(
                (progress) =>
                  progress.lessonId === lesson.id && progress.completed
              )
            );
          return (
            <Collapsible key={index} defaultOpen={index === 0}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className={[
                    "w-full p-3 h-auto flex items-center gap-2 transition-all",
                    chapterCompleted
                      ? "!bg-green-100 dark:!bg-teal-900/50 !text-green-800 dark:!text-teal-200 !border-teal-300 dark:!border-teal-700"
                      : "!border-muted-foreground/20 dark:!border-muted-foreground/20",
                  ].join(" ")}
                >
                  <div className="shrink-0">
                    <ChevronDown
                      className={
                        chapterCompleted
                          ? "size-4 text-green-800 dark:text-teal-200"
                          : "size-4 text-primary"
                      }
                    />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className={[
                        "font-semibold text-sm truncate",
                        chapterCompleted
                          ? "text-green-950 dark:text-green-50"
                          : "text-foreground",
                      ].join(" ")}
                    >
                      {chapter.position}. {chapter.title}
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      {chapter.lessons.length} lessons
                    </p>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                {chapter.lessons.map((lesson, index) => (
                  <LessonItem
                    key={index}
                    lesson={lesson}
                    slug={course.slug}
                    isActive={isActive(lesson.id)}
                    completed={
                      lesson.lessonProgress.find(
                        (progress) => progress.lessonId == lesson.id
                      )?.completed || false
                    }
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}

export default CourseSidebar;
