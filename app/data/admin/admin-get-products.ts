import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetProducts() {
  await requireAdmin();

  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
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

export type AdminProductType = Awaited<
  ReturnType<typeof adminGetProducts>
>[number];

