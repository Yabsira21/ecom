"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createProduct,
  updateProduct,
} from "@/app/data/admin/admin-product-actions";
import type { AdminProductDetailType } from "@/app/data/admin/admin-get-product";
import { Uploader } from "@/components/file-uploader/Uploader";
import { MultiImageUploader } from "@/components/file-uploader/MultiImageUploader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { tryCatch } from "@/hooks/try-catch";
import {
  productSchema,
  type ProductFormValues,
  type ProductSchemaType,
} from "@/lib/zodSchema";

type ProductFormProps = {
  product?: AdminProductDetailType;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-destructive">{message}</p>;
}

function Field({
  htmlFor,
  label,
  error,
  description,
  children,
}: {
  htmlFor?: string;
  label: string;
  error?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={htmlFor}>{label}</Label>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const defaultValues: ProductFormValues = {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    category: product?.category ?? "",
    primaryImage: product?.primaryImage ?? "",
    images: product?.images ?? [],
    isActive: product?.isActive ?? true,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues, unknown, ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const nameValue = watch("name");

  const handleGenerateSlug = () => {
    if (nameValue) {
      setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    setResetKey((k) => k + 1);
  };

  const onSubmit = (values: ProductSchemaType) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        product ? updateProduct(product.id, values) : createProduct(values),
      );

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (data?.status === "success") {
        toast.success(data.message);
        router.push("/admin/product");
        router.refresh();
      } else if (data?.status === "error") {
        toast.error(data.message);
      }
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/product"
          className={buttonVariants({ variant: "outline", size: "icon" })}
          aria-label="Back to products"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {product ? "Edit Product" : "Create Product"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {product
              ? "Update details, images, and inventory visibility for this product."
              : "Fill out the fields below to add a new product to your catalog."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Basic Information */}
        <FormSection
          title="General Information"
          description="Basic details identifying your product in the storefront."
        >
          <Field
            htmlFor="name"
            label="Product Name"
            error={errors.name?.message}
          >
            <Input
              id="name"
              placeholder="e.g. Minimalist Wireless Headphones"
              {...register("name")}
            />
          </Field>

          <Field
            htmlFor="slug"
            label="Slug (URL identifier)"
            error={errors.slug?.message}
            description="The unique identifier used in the URL. Lowercase, numbers and hyphens only."
          >
            <div className="flex gap-2">
              <Input
                id="slug"
                placeholder="e.g. minimalist-wireless-headphones"
                {...register("slug")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateSlug}
                title="Generate slug from product name"
              >
                <Sparkles className="mr-1.5 size-4 text-primary" />
                Generate
              </Button>
            </div>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              htmlFor="category"
              label="Category"
              error={errors.category?.message}
              description="e.g. Electronics, Apparel, Books"
            >
              <Input
                id="category"
                placeholder="e.g. Electronics"
                {...register("category")}
              />
            </Field>

            <Field
              htmlFor="price"
              label="Price (USD)"
              error={errors.price?.message}
              description="Standard selling price"
            >
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="29.99"
                {...register("price", { valueAsNumber: true })}
              />
            </Field>
          </div>

          <Field
            htmlFor="description"
            label="Description"
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              rows={4}
              placeholder="Detailed description of features, materials, specifications, etc."
              {...register("description")}
            />
          </Field>
        </FormSection>

        {/* Primary Image Upload */}
        <FormSection
          title="Primary Image"
          description="Main cover picture that appears on cards, search results, and thumbnail previews."
        >
          <Field
            label="Upload Primary Cover Image"
            error={errors.primaryImage?.message}
          >
            <Controller
              control={control}
              name="primaryImage"
              render={({ field }) => (
                <Uploader
                  key={`primary-${resetKey}`}
                  fileTypeAccepted="image"
                  value={field.value}
                  onChange={field.onChange}
                  onBusyChange={setIsUploading}
                />
              )}
            />
          </Field>
        </FormSection>

        {/* Gallery / Multi-Image Upload */}
        <FormSection
          title="Product Gallery"
          description="Add additional photos to show multiple angles, variants, or in-use shots."
        >
          <Field
            label="Additional Images (up to 8)"
            error={errors.images?.message}
          >
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <MultiImageUploader
                  key={`multi-${resetKey}`}
                  value={field.value || []}
                  onChange={field.onChange}
                  max={8}
                  onBusyChange={setIsUploading}
                />
              )}
            />
          </Field>
        </FormSection>

        {/* Availability & Status */}
        <FormSection
          title="Visibility"
          description="Control whether this product is visible to customers in your store."
        >
          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              className="size-4 rounded accent-primary cursor-pointer"
              {...register("isActive")}
            />
            <Label htmlFor="isActive" className="cursor-pointer font-medium">
              Product is active and visible on the storefront
            </Label>
          </div>
        </FormSection>

        {/* Form Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isPending || isUploading}
          >
            Reset Form
          </Button>

          <Button
            type="submit"
            disabled={isPending || isUploading}
            className="min-w-32"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {product ? "Saving..." : "Creating..."}
              </>
            ) : isUploading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Uploading...
              </>
            ) : product ? (
              "Save Changes"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

