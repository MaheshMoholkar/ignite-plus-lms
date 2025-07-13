import { getCourseBySlug } from "@/app/data/course/get-course-by-slug";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { useConstructUrl } from "@/hooks/use-contruct-url";
import { courseCategoryLabels, courseLevelLabels } from "@/lib/zodSchemas";
import {
  IconChartBar,
  IconCategory,
  IconClock,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react";
import Image from "next/image";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";

async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-8">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={useConstructUrl(course.fileKey)}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="mt-8 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
              {course.smallDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />{" "}
              <span>{courseLevelLabels[course.level]}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory className="size-4" />
              <span>{courseCategoryLabels[course.category]}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              <span>{course.duration} hours</span>
            </Badge>
          </div>
          <Separator className="my-8" />
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Course Description
            </h2>
            <RenderDescription description={JSON.parse(course.description)} />
          </div>
        </div>
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-light">
              Course Content
            </h2>
            <div>
              {course.chapters.length} chapters |{" "}
              {course.chapters.reduce(
                (acc, chapter) => acc + chapter.lessons.length,
                0
              )}{" "}
              lessons
            </div>
          </div>

          <div className="space-y-4">
            {course.chapters.map((chapter, index) => (
              <Collapsible key={chapter.id} defaultOpen={index === 0}>
                <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
                  <CollapsibleTrigger>
                    <div>
                      <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <p className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                              {index + 1}
                            </p>
                            <div>
                              <h3 className="text-xl font-semibold text-left">
                                {chapter.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 text-left">
                                {chapter.lessons.length}{" "}
                                {chapter.lessons.length > 1
                                  ? "lessons"
                                  : "lesson"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {chapter.lessons.length}{" "}
                              {chapter.lessons.length > 1
                                ? "lessons"
                                : "lesson"}
                            </Badge>
                            <IconChevronDown className="size-5 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t bg-muted/20">
                      <div className="p-6 pt-4 space-y-3">
                        {chapter.lessons.map((lesson, index) => (
                          <div key={index}>
                            <p>{lesson.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
