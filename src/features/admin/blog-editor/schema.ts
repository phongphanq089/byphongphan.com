import { z } from "zod"

export const postFormSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase alphanumeric characters and hyphens"
    ),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters for search engines")
    .max(350, "Excerpt should not exceed 350 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  category: z.string().min(1, "Please select an article category"),
  tags: z.array(z.string()).min(1, "Please attach at least one tag"),
  groupId: z.string().optional(),
  groupOrder: z.number().optional(),
  readTime: z.number().min(1).max(120),
  status: z.enum(["draft", "published", "archived"]),
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().optional(),
})

export type PostFormValues = z.infer<typeof postFormSchema>

export const DEFAULT_POST_VALUES: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  coverImageAlt: "Cover banner preview",
  category: "Architecture",
  tags: ["React 19"],
  groupId: "",
  groupOrder: 1,
  readTime: 5,
  status: "draft",
  isFeatured: false,
  publishedAt: new Date().toISOString().split("T")[0],
}
