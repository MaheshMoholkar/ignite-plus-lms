import { z } from "zod";

// Enum values for database
export const courseLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export const courseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const courseCategories = [
  "WEB_DEVELOPMENT",
  "MOBILE_DEVELOPMENT",
  "DATA_SCIENCE",
  "AI",
  "GAME_DEVELOPMENT",
] as const;

export const courseLevelLabels: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export const courseStatusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export const courseCategoryLabels: Record<string, string> = {
  WEB_DEVELOPMENT: "Web Development",
  MOBILE_DEVELOPMENT: "Mobile Development",
  DATA_SCIENCE: "Data Science",
  AI: "AI",
  GAME_DEVELOPMENT: "Game Development",
};

// Utility functions for getting display labels
export const getCourseLevelLabel = (level: string) =>
  courseLevelLabels[level] || level;
export const getCourseStatusLabel = (status: string) =>
  courseStatusLabels[status] || status;
export const getCourseCategoryLabel = (category: string) =>
  courseCategoryLabels[category] || category;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  fileKey: z.string().min(1, { message: "File key is required" }),
  price: z.coerce
    .number()
    .min(1, { message: "Price must be greater than 0" }) as z.ZodNumber,
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be greater than 0" })
    .max(500, { message: "Duration must be less than 500" }) as z.ZodNumber,
  level: z.enum(courseLevels, { message: "Invalid level" }),
  category: z.enum(courseCategories, { message: "Invalid category" }),
  smallDescription: z
    .string()
    .min(10, { message: "Small description must be at least 10 characters" })
    .max(200, {
      message: "Small description must be less than 200 characters",
    }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
  status: z.enum(courseStatus, { message: "Invalid status" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
