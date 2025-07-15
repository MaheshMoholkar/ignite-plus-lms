"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-contruct-url";
import { BookIcon, CheckCircle } from "lucide-react";
import React, { startTransition } from "react";
import { markLessonComplete } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";

function CourseContent({
  lesson,
  slug,
}: {
  lesson: LessonContentType;
  slug: string;
}) {
  const { triggerConfetti } = useConfetti();
  const onSubmit = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markLessonComplete(lesson.id, slug)
      );
      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={lesson.thumbnailKey ?? ""}
        videoKey={lesson.videoKey ?? ""}
      />
      <div className="py-4 border-b">
        {lesson.lessonProgress.find(
          (progress) => progress.lessonId === lesson.id
        )?.completed === false ? (
          <Button variant="outline" onClick={onSubmit}>
            <CheckCircle className="size-4 mr-2 text-green-500" />
            <span>Mark as Complete</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-green-500/10 text-green-700 dark:bg-teal-500/20 dark:text-teal-400"
            disabled
          >
            <CheckCircle className="size-4 mr-2 text-teal-500" />
            <span>Completed</span>
          </Button>
        )}
      </div>
      <div className="space-y-3 pt-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {lesson.title}
        </h1>
        {lesson.description && (
          <RenderDescription description={JSON.parse(lesson.description)} />
        )}
      </div>
    </div>
  );
}

export default CourseContent;

function VideoPlayer({
  thumbnailKey,
  videoKey,
}: {
  thumbnailKey: string;
  videoKey: string;
}) {
  const videoUrl = useConstructUrl(videoKey);
  const thumbnailUrl = useConstructUrl(thumbnailKey);

  if (!videoKey || !thumbnailKey)
    return (
      <div className="aspect-video bg-muted flex flex-col items-center justify-center">
        <BookIcon className="size-16 text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">
          This lesson does not have a video yet.
        </p>
      </div>
    );

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        src={videoUrl}
        className="w-full h-full object-cover"
        controls
        poster={thumbnailUrl}
      />
    </div>
  );
}
