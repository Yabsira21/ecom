import { getSession } from "@/lib/get-session";
import { getPublishedProducts } from "@/app/data/user/get-products";
import { StorefrontClient } from "./_components/StorefrontClient";

export default async function Home() {
  const [session, products] = await Promise.all([
    getSession(),
    getPublishedProducts().catch(() => []),
  ]);

  return (
    <StorefrontClient
      user={
        session
          ? {
              name: session.user.name,
              image: session.user.image,
              email: session.user.email,
              role: session.user.role,
            }
          : null
      }
      products={products}
    />
  );
}
