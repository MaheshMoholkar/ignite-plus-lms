"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";
import React from "react";

function LessonItem({
  lesson,
  slug,
  isActive,
  completed,
}: {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
  slug: string;
  isActive: boolean;
  completed: boolean | null;
}) {
  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      className={buttonVariants({
        variant: "outline",
        className: cn(
          "w-full p-2.5 h-auto justify-start transition-all",
          isActive
            ? "!bg-orange-100 dark:!bg-orange-900/50 !text-orange-800 dark:!text-orange-200 !border-orange-300 dark:!border-orange-700"
            : completed
              ? "!bg-green-100 dark:!bg-teal-900/50 !text-green-800 dark:!text-teal-200 !border-teal-300 dark:!border-teal-700"
              : "!border-muted-foreground/20 dark:!border-muted-foreground/20"
        ),
      })}
    >
      <div className="flex items-center gap-2.5 w-full min-w-0">
        <div className="shrink-0">
          {completed ? (
            <div className="size-5 rounded-full bg-green-200 dark:bg-green-600 flex items-center justify-center">
              <Check className="size-3 text-green-800 dark:text-green-200" />
            </div>
          ) : (
            <div className="size-5 rounded-full border-2 bg-primary/10 flex justify-center items-center">
              <Play className="size-2.5 fill-current" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p
            className={cn(
              "text-xs font-medium truncate",
              completed
                ? "text-green-950 dark:text-green-50"
                : isActive
                  ? "text-primary font-semibold"
                  : "text-foreground"
            )}
          >
            {lesson.position}. {lesson.title}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default LessonItem;
