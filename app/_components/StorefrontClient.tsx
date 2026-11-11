"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LogOut,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/themeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useContructUrl } from "@/hooks/use-construct-url";
import { cn } from "@/lib/utils";
import type { StoreProduct } from "@/app/data/user/get-products";

type StorefrontClientProps = {
  products: StoreProduct[];
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  } | null;
};

function ProductCard({ product }: { product: StoreProduct }) {
  const [selectedImage, setSelectedImage] = useState<string>(product.primaryImage);
  const imageUrl = useContructUrl(selectedImage);

  const allImages = [product.primaryImage, ...(product.images || [])].filter(Boolean);

  const handleAddToCart = () => {
    toast.success(`Added "${product.name}" to cart!`);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {selectedImage ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Package className="size-12 opacity-30" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {product.category}
          </span>
        </div>

        {/* Additional Images Thumbnail Gallery if multiple exist */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/50 p-1 backdrop-blur-md opacity-90 transition-opacity">
            {allImages.slice(0, 5).map((imgKey, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(imgKey)}
                className={cn(
                  "size-2.5 rounded-full transition-all",
                  selectedImage === imgKey
                    ? "bg-white scale-125"
                    : "bg-white/40 hover:bg-white/80",
                )}
                aria-label={`View photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <span className="text-base font-bold text-primary shrink-0">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground">
            {allImages.length} {allImages.length === 1 ? "image" : "images"}
          </span>

          <Button
            size="sm"
            onClick={handleAddToCart}
            className="rounded-lg gap-1.5 font-medium"
          >
            <ShoppingBag className="size-3.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}

export function StorefrontClient({ products, user }: StorefrontClientProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Logout failed");
          },
        },
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Store Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Store className="size-5" />
            </span>
            <div className="leading-none">
              <span className="text-lg font-bold tracking-tight">E-Store</span>
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Right actions: Admin link, theme toggle, user auth */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/product"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Admin Dashboard
            </Link>

            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      aria-label="User Account Menu"
                      className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  }
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound className="size-4" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs font-normal text-muted-foreground">
                        {user.email}
                      </p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/admin/product")}
                  >
                    <Package className="mr-2 size-4" />
                    Manage Products
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    <LogOut className="mr-2 size-4" />
                    {loggingOut ? "Signing out..." : "Sign Out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants({ size: "sm" }), "rounded-lg px-4")}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/50 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6">
              <Sparkles className="size-3.5" />
              New Collection Available
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl mx-auto">
              Quality Products Crafted for You
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
              Explore our exclusive range of hand-picked goods with simple and fast delivery.
            </p>

            {/* Quick search input in hero */}
            <div className="mt-8 mx-auto max-w-md relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-full shadow-sm bg-card"
              />
            </div>
          </div>
        </section>

        {/* Catalog & Filter Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between pb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Our Products</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {/* Category pills */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Products Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="size-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No products found</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                {searchQuery || selectedCategory !== "All"
                  ? "Try clearing your search query or choosing another category."
                  : "No products have been added to the store yet. Add your first product from the admin panel."}
              </p>
              {products.length === 0 && (
                <Link
                  href="/admin/product/create"
                  className={cn(buttonVariants(), "mt-6 gap-2")}
                >
                  <Package className="size-4" />
                  Add First Product
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} E-Store. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin/product" className="hover:underline">
              Admin Portal
            </Link>
            <Link href="/" className="hover:underline">
              Storefront
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

