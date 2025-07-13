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
import { chapterSchema, ChapterSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusIcon } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { CreateChapter } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

function NewChapterModal({ courseId }: { courseId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      courseId: courseId,
    },
  });

  function handleOpenChange(open: boolean) {
    if (!open) form.reset();
    setIsOpen(open);
  }

  async function onSubmit(values: ChapterSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(CreateChapter(values));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setIsOpen(false);
        form.reset();
      } else if (result.status === "error") {
        toast.error("Failed to create chapter");
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <PlusIcon className="size-4" /> New Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Chapter</DialogTitle>
          <DialogDescription>
            Create a new chapter for the course.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter chapter title" />
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
                Create Chapter
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default NewChapterModal;
