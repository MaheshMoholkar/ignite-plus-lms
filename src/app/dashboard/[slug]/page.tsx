import React from "react";
import { getCourseBySlug } from "../../data/course/get-course-by-slug";
import { Badge } from "@/components/ui/badge";
import { useConstructUrl } from "@/hooks/use-contruct-url";
import Image from "next/image";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { courseLevelLabels, courseCategoryLabels } from "@/lib/zodSchemas";
import {
  IconChartBar,
  IconCategory,
  IconClock,
  IconChevronDown,
  IconPlayerPlay,
  IconBook,
} from "@tabler/icons-react";
import { CheckIcon } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

interface CourseSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlug({ params }: CourseSlugPageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) {
    return (
      <EmptyState
        title="Course not found"
        description="This course does not exist or you are not enrolled."
        buttonText="Browse Courses"
        href="/dashboard/courses"
      />
    );
  }
  const imageUrl = useConstructUrl(course.fileKey);
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg mb-8">
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {course.title}
          </h1>
          <div className="flex flex-wrap gap-3 mb-2">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
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
          <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
            {course.smallDescription}
          </p>
        </div>
        <Separator className="my-8" />
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Course Description
          </h2>
          <RenderDescription description={JSON.parse(course.description)} />
        </div>
      </div>
    </div>
  );
}
