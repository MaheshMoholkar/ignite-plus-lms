import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { useConstructUrl } from "@/hooks/use-contruct-url";
import Link from "next/link";
import {
  ArrowRightIcon,
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  School,
  TimerIcon,
  TrashIcon,
} from "lucide-react";
import { courseLevelLabels } from "@/lib/zodSchemas";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminCourseCard({
  id,
  title,
  description,
  smallDescription,
  duration,
  level,
  status,
  price,
  fileKey,
  slug,
}: AdminCourseType) {
  return (
    <Card className="group relative py-0 gap-0">
      {/* absolute dropdown */}
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="cursor-pointer">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${id}/edit`}>
                <PencilIcon className="size-4 mr-2" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${slug}`}>
                <EyeIcon className="size-4 mr-2" />
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/admin/courses/${id}/delete`}>
                <TrashIcon className="size-4 mr-2 text-destructive" />
                Delete Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={useConstructUrl(fileKey)}
        alt={title}
        width={400}
        height={600}
        className="w-full rounded-t-lg  aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${id}`}
          className="text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors"
        >
          {title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">
              {courseLevelLabels[level]}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/courses/${id}/edit`}
          className={buttonVariants({
            className: "mt-4 w-full",
          })}
        >
          Edit Course <ArrowRightIcon className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function AdminCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="size-8 rounded-md" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-lg aspect-video h-[250px] object-cover" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        <Skeleton className="h-6 w-full mb-4 rounded" />
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded" />
      </CardContent>
    </Card>
  );
}
