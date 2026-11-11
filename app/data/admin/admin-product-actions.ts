"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { productSchema, ProductSchemaType } from "@/lib/zodSchema";
import { requireAdmin } from "./require-admin";

function refresh(id?: string) {
  revalidatePath("/");
  revalidatePath("/admin/product");
  if (id) {
    revalidatePath(`/admin/product/${id}/edit`);
  }
}

export async function createProduct(
  values: ProductSchemaType,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    const validation = productSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: validation.error.issues[0]?.message || "Invalid form data",
      };
    }

    const data = validation.data;

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (existing) {
      return {
        status: "error",
        message: "A product with this slug already exists. Please change the slug.",
      };
    }

    await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        category: data.category,
        primaryImage: data.primaryImage,
        images: data.images,
        isActive: data.isActive,
      },
    });

    refresh();

    return {
      status: "success",
      message: "Product created successfully",
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      status: "error",
      message: "Failed to create product",
    };
  }
}

export async function updateProduct(
  id: string,
  values: ProductSchemaType,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    const validation = productSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: validation.error.issues[0]?.message || "Invalid form data",
      };
    }

    const data = validation.data;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });

    if (!existingProduct) {
      return {
        status: "error",
        message: "Product not found",
      };
    }

    // Check slug uniqueness if changed
    if (existingProduct.slug !== data.slug) {
      const slugOccupied = await prisma.product.findUnique({
        where: { slug: data.slug },
        select: { id: true },
      });
      if (slugOccupied) {
        return {
          status: "error",
          message: "A product with this slug already exists",
        };
      }
    }

    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        category: data.category,
        primaryImage: data.primaryImage,
        images: data.images,
        isActive: data.isActive,
      },
    });

    refresh(id);

    return {
      status: "success",
      message: "Product updated successfully",
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      status: "error",
      message: "Failed to update product",
    };
  }
}

export async function deleteProduct(id: string): Promise<APIResponse> {
  await requireAdmin();

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!product) {
      return {
        status: "error",
        message: "Product not found",
      };
    }

    await prisma.product.delete({
      where: { id },
    });

    refresh(id);

    return {
      status: "success",
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      status: "error",
      message: "Failed to delete product",
    };
  }
}

export async function toggleProductActive(
  id: string,
  isActive: boolean,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    await prisma.product.update({
      where: { id },
      data: { isActive },
    });

    refresh(id);

    return {
      status: "success",
      message: isActive ? "Product activated" : "Product deactivated",
    };
  } catch (error) {
    console.error("Error updating product status:", error);
    return {
      status: "error",
      message: "Failed to update product status",
    };
  }
}
