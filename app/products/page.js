import ProductCatalogue from '@/components/ProductCatalogue';
import { BASE_URL } from '@/lib/pb';

export const dynamic = 'force-dynamic';

// Fetched through the API route and cached; the API routes call revalidateTag('products') on any change.
async function getProducts() {
  const res = await fetch(`${BASE_URL}/api/products`, { next: { tags: ['products'], revalidate: 60 } });
  return res.ok ? res.json() : [];
}

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <>
      <h1>Products</h1>
      <ProductCatalogue products={products} />
    </>
  );
}
