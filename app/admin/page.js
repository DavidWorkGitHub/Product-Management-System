import Charts from '@/components/Charts';
import { BASE_URL } from '@/lib/pb';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const res = await fetch(`${BASE_URL}/api/products`, { cache: 'no-store' });
  const products = res.ok ? await res.json() : [];

  // Count laptops per brand
  const counts = {};
  for (const p of products) counts[p.brand] = (counts[p.brand] || 0) + 1;

  return (
    <>
      <h1>Admin: Stock by Brand</h1>
      <p>Total products: {products.length}</p>
      <Charts counts={counts} />
    </>
  );
}
