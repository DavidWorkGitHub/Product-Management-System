import ProductCatalogue from '@/components/ProductCatalogue';
import { BASE_URL } from '@/lib/pb';

export const dynamic = 'force-dynamic';

// Fetched through the API route and cached; the API routes call revalidateTag('products') on any change.
async function getProducts() {
  try {
    const res = await fetch(`${BASE_URL}/api/products`, { next: { tags: ['products'], revalidate: 60 } });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <>
      <h1>Products</h1>
      {Array.isArray(products) ? (
        <ProductCatalogue products={products} />
      ) : (
        <p role="alert">Could not load products. Please refresh to try again.</p>
      )}
    </>
  );
}
