import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetProduct(id: string) {
  await requireAdmin();

  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      category: true,
      primaryImage: true,
      images: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export type AdminProductDetailType = NonNullable<
  Awaited<ReturnType<typeof adminGetProduct>>
>;

