import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { adminGetProducts } from "@/app/data/admin/admin-get-products";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductCard, ProductCardSkeleton } from "./_components/ProductCard";

async function ProductContent() {
  const products = await adminGetProducts();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border px-6 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <Package className="size-6 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">No products yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by adding your first product to the store inventory.
          </p>
        </div>
        <Link href="/admin/product/create" className={buttonVariants()}>
          <Plus className="mr-2 size-4" />
          Create Product
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ProductAdminPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your store&apos;s product inventory, images, prices, and visibility.
          </p>
        </div>
        <Link
          className={cn(buttonVariants(), "shrink-0 self-start sm:self-auto")}
          href="/admin/product/create"
        >
          <Plus className="mr-2 size-4" />
          Create Product
        </Link>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductContent />
      </Suspense>
    </div>
  );
}

