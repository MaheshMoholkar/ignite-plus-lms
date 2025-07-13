import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusIcon } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { CreateLesson } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";

function NewLessonModal({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      courseId: courseId,
      chapterId: chapterId,
    },
  });

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  async function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(CreateLesson(values));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setIsOpen(false);
        form.reset();
      } else if (result.status === "error") {
        toast.error(result.message || "Failed to create lesson");
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex justify-center w-full gap-2"
        >
          <PlusIcon className="size-4" /> New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Lesson</DialogTitle>
          <DialogDescription>
            Create a new lesson for the course.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter lesson title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isPending}
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="size-4 animate-spin" />
                )}
                Create Lesson
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default NewLessonModal;
