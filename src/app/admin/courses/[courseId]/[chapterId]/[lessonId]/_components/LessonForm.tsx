"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import FileUploader from "@/components/file-uploader/FileUploader";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2Icon, PencilIcon } from "lucide-react";
import Link from "next/link";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";

function LessonForm({
  lesson,
  chapterId,
  courseId,
}: {
  lesson: AdminLessonType;
  chapterId: string;
  courseId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title,
      courseId,
      chapterId,
      description: lesson.description ?? undefined,
      thumbnailKey: lesson.thumbnailKey ?? undefined,
      videoKey: lesson.videoKey ?? undefined,
    },
  });

  const onSubmit = (values: LessonSchemaType) => {};

  return (
    <div>
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={buttonVariants({
          variant: "outline",
          className: "mb-6",
        })}
      >
        <ArrowLeft className="size-4" /> <span>Go Back</span>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit Lesson</CardTitle>
          <CardDescription>
            Configure the video and descripton for this lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onChange={field.onChange}
                        fileType="image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onChange={field.onChange}
                        fileType="video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    Saving...
                    <Loader2Icon className="size-4 ml-1 animate-spin" />
                  </>
                ) : (
                  <>
                    <PencilIcon className="size-4 mr-1" />
                    Save Lesson
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LessonForm;
