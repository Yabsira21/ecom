"use client";

import {
  ArrowUpRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  deleteProduct,
  toggleProductActive,
} from "@/app/data/admin/admin-product-actions";
import type { AdminProductType } from "@/app/data/admin/admin-get-products";
import { useContructUrl } from "@/hooks/use-construct-url";
import { cn } from "@/lib/utils";

const iconButton =
  "flex size-8 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-inset ring-white/20 backdrop-blur-md transition hover:scale-105 disabled:opacity-60";

export function ProductCard({ product }: { product: AdminProductType }) {
  const imageUrl = useContructUrl(product.primaryImage);

  const [isDeleting, startDelete] = useTransition();
  const [isToggling, startToggle] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    startDelete(async () => {
      const result = await deleteProduct(product.id);

      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleToggle = () => {
    startToggle(async () => {
      const result = await toggleProductActive(
        product.id,
        !product.isActive,
      );

      if (result.status === "success") toast.success(result.message);
      else toast.error(result.message);
    });
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition hover:shadow-md">
      {/* Top Image Preview Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {product.primaryImage ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-12 opacity-40" />
          </div>
        )}

        {/* Top-left: status & category */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-md",
              product.isActive ? "bg-emerald-600/85" : "bg-neutral-800/85",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                product.isActive ? "bg-white" : "bg-amber-400",
              )}
            />
            {product.isActive ? "Active" : "Draft"}
          </span>

          <span className="inline-flex items-center rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-md">
            {product.category}
          </span>
        </div>

        {/* Top-right: quick actions */}
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggle}
            disabled={isToggling}
            aria-label={product.isActive ? "Deactivate" : "Activate"}
            title={product.isActive ? "Deactivate product" : "Activate product"}
            className={cn(iconButton, "hover:bg-white/30")}
          >
            {isToggling ? (
              <Loader2 size={14} className="animate-spin" />
            ) : product.isActive ? (
              <Eye size={14} />
            ) : (
              <EyeOff size={14} />
            )}
          </button>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
              render={
                <button
                  type="button"
                  aria-label={`Delete ${product.name}`}
                  className={cn(iconButton, "hover:bg-destructive")}
                />
              }
            >
              <Trash2 size={14} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                <AlertDialogDescription>
                  &ldquo;{product.name}&rdquo; will be permanently deleted from the store. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Extra images counter badge */}
        {product.images && product.images.length > 0 && (
          <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-md">
            +{product.images.length} {product.images.length === 1 ? "photo" : "photos"}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-foreground">
              {product.name}
            </h3>
            <span className="text-base font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            /{product.slug}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>

          <Link
            href={`/admin/product/${product.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            Edit
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-muted/40 p-0 shadow-sm animate-pulse">
      <div className="aspect-video w-full bg-muted" />
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-5 w-1/2 rounded bg-muted" />
            <div className="h-5 w-16 rounded bg-muted" />
          </div>
          <div className="h-3 w-1/3 rounded bg-muted/60" />
          <div className="h-4 w-full rounded bg-muted/60" />
        </div>
        <div className="flex justify-between border-t border-border/40 pt-4">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-7 w-16 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

