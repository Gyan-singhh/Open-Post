import { z } from "zod";

export const PostCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  likes: z.array(z.string()).optional(),
  comments: z.array(z.string()).optional(),
  image: z
    .instanceof(FileList)
    .refine((fileList) => fileList.length > 0, "Image is required")
    .refine(
      (fileList) =>
        ["image/jpeg", "image/png", "image/webp"].includes(fileList[0]?.type),
      "Only JPEG, PNG, or WebP files are allowed"
    ),
});

export type PostCreateInput = z.infer<typeof PostCreateSchema>;
