import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"];

export const courseStatus = ["Draft", "Published", "Archived"];

export const courseCategories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "AI",
  "Game Development",
];

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
  price: z.number().min(1, { message: "Price must be greater than 0" }),
  duration: z
    .number()
    .min(1, { message: "Duration must be greater than 0" })
    .max(500, { message: "Duration must be less than 500" }),
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
