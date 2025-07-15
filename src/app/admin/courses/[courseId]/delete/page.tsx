"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React, { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { DeleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";
import { Loader2Icon, Trash2 } from "lucide-react";

function DeleteCourseRoute() {
  const [pending, startTransition] = useTransition();

  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  const onSubmit = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(DeleteCourse(courseId));
      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto w-full mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Delete Course</CardTitle>
          <CardDescription>
            Are you sure you want to delete this course?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-x-2">
          <Link
            href={"/admin/courses"}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={pending}
            className="w-fit"
            onClick={onSubmit}
          >
            {pending ? (
              <>
                Deleting...
                <Loader2Icon className="size-4 ml-1 animate-spin" />
              </>
            ) : (
              <>
                <Trash2 className="size-4 mr-1" />
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default DeleteCourseRoute;
