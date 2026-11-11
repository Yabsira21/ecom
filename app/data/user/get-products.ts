import "server-only";

import { prisma } from "@/lib/db";

export async function getPublishedProducts() {
  return prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      category: true,
      primaryImage: true,
      images: true,
      createdAt: true,
    },
  });
}

export type StoreProduct = Awaited<ReturnType<typeof getPublishedProducts>>[number];

