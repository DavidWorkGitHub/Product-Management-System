import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { BASE_URL } from '@/lib/pb';

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
      {products.length === 0 && <p>No products yet. <Link href="/products/add">Add one</Link>.</p>}
      <div className="grid">
        {products.map((p) => (
          <article className="card" key={p.id}>
            <span className="badge">{p.brand}</span>
            <h3>{p.model}</h3>
            <p className="price">€{Number(p.price).toFixed(2)}</p>
            <div className="actions">
              <Link className="btn" href={`/products/${p.id}`}>View</Link>
              <Link className="btn secondary" href={`/products/${p.id}/edit`}>Edit</Link>
              <DeleteButton id={p.id} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
