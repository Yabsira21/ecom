import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(120, "Product name is too long"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(120, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must only contain lowercase letters, numbers, and hyphens",
    ),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters"),
  price: z.coerce
    .number()
    .min(0.01, "Price must be greater than 0"),
  category: z
    .string()
    .trim()
    .min(1, "Category is required"),
  primaryImage: z
    .string()
    .min(1, "Primary image is required"),
  images: z
    .array(z.string())
    .default([]),
  isActive: z.boolean().default(true),
});

export type ProductFormValues = z.input<typeof productSchema>;
export type ProductSchemaType = z.output<typeof productSchema>;
