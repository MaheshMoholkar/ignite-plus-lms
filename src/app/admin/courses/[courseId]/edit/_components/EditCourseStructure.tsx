"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { ReactNode, useEffect, useState } from "react";
import { AdminGetCourseType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { UpdateCourseChapters, UpdateCourseLessons } from "../actions";
import NewChapterModal from "./NewChapterModal";
import NewLessonModal from "./NewLessonModal";
import { DeleteLessonAlert } from "./DeleteLesson";
import { DeleteChapterAlert } from "./DeleteChapter";

function EditCourseStructure({ course }: { course: AdminGetCourseType }) {
  const initialItems =
    course.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];

  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems((prevItems) => {
      const updatedItems =
        course.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.position,
          isOpen:
            prevItems.find((item) => item.id == chapter.id)?.isOpen ?? true,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];

      return updatedItems;
    });
  }, [course]);

  function SortableItem(props: {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => ReactNode;
    className?: string;
    data?: {
      type: "chapter" | "lesson";
      chapterId?: string;
    };
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transition,
      transform,
      isDragging,
    } = useSortable({ id: props.id, data: props.data });

    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn("touch-none", props.className, isDragging ? "z-10" : "")}
      >
        {props.children(listeners)}
      </div>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";

    if (activeType === "chapter") {
      let targetChapterId = null;

      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) {
        toast.error("Please drop the chapter in the correct position");
        return;
      }

      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Invalid Action");
        return;
      }

      const newItems = arrayMove(items, oldIndex, newIndex);

      const reorderedItems = newItems.map((chapter, index) => ({
        ...chapter,
        order: index + 1,
      }));

      const previousItems = [...items];

      setItems(reorderedItems);

      if (course.id) {
        const chaptersToUpdate = reorderedItems.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));

        const reorderChaptersPromise = () =>
          UpdateCourseChapters(course.id, chaptersToUpdate);

        toast.promise(reorderChaptersPromise(), {
          loading: "Reordering Chapters...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItems);
            return "Failed to reorder chapters";
          },
        });
      }

      return;
    }

    if (activeType === "lesson" && overType == "lesson") {
      const chapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;

      if (!chapterId || chapterId !== overChapterId) {
        toast.error("Not Allowed");
        return;
      }

      const chapterIndex = items.findIndex(
        (chapter) => chapter.id === chapterId
      );

      if (chapterIndex === -1) {
        toast.error("Invalid Action");
        return;
      }

      const chapterToUpdate = items[chapterIndex];

      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === activeId
      );

      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === overId
      );

      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Invalid Action");
        return;
      }

      const newLessons = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );

      const reorderedLessons = newLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const newItems = [...items];

      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: reorderedLessons,
      };

      const previousItems = [...items];

      setItems(newItems);

      if (course.id) {
        const lessonsToUpdate = reorderedLessons.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));

        const reorderLessonsPromise = () =>
          UpdateCourseLessons(chapterId, course.id, lessonsToUpdate);

        toast.promise(reorderLessonsPromise(), {
          loading: "Reordering Lessons...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItems);
            return "Failed to reorder lessons";
          },
        });
      }

      return;
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function toggleChapter(chapterId: string) {
    setItems((chapters) => {
      const chapter = chapters.find((chapter) => chapter.id === chapterId);
      if (!chapter) return chapters;
      return chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      );
    });
  }

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row justify-between items-center border-b border-border">
          <CardTitle>Chapters</CardTitle>
          <NewChapterModal courseId={course.id} />
        </CardHeader>
        <CardContent className="space-y-8">
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter", chapterId: item.id }}
              >
                {(listeners) => (
                  <Card className="flex flex-col gap-2">
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost" {...listeners}>
                            <GripVertical className="size-4"></GripVertical>
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="flex items-center"
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p
                            className="cursor-pointer hover:text-primary"
                            onClick={() => toggleChapter(item.id)}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            {item.title}
                          </p>
                        </div>
                        <div
                          className="flex gap-2"
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <DeleteChapterAlert
                            chapterId={item.id}
                            courseId={course.id}
                          />
                        </div>
                      </div>
                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            items={item.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(listeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        {...listeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${course.id}/${item.id}/${lesson.id}`}
                                        className="cursor-pointer hover:text-primary"
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <div
                                      onPointerDown={(e) => e.stopPropagation()}
                                    >
                                      <DeleteLessonAlert
                                        lessonId={lesson.id}
                                        courseId={course.id}
                                        chapterId={item.id}
                                      />
                                    </div>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                            <div
                              className="p-2"
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              <NewLessonModal
                                courseId={course.id}
                                chapterId={item.id}
                              />
                            </div>
                          </SortableContext>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}

export default EditCourseStructure;
