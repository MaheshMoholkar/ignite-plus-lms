import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { DeleteLesson } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

export function DeleteLessonAlert({
  lessonId,
  courseId,
  chapterId,
}: {
  lessonId: string;
  courseId: string;
  chapterId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        DeleteLesson(lessonId, courseId, chapterId)
      );
      if (error) {
        toast.error(error.message);
        return;
      }
      if (result.status === "success") {
        toast.success("Lesson deleted successfully");
        setOpen(false);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this lesson?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onSubmit} disabled={pending}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
