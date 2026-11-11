import { notFound } from "next/navigation";

import { adminGetProduct } from "@/app/data/admin/admin-get-product";
import ProductForm from "../../_components/ProductForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const product = await adminGetProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductForm product={product} />;
}

