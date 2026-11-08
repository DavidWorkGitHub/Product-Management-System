import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductPhoto from '@/components/ProductPhoto';
import DeleteButton from '@/components/DeleteButton';
import { BASE_URL, getPb } from '@/lib/pb';

export default async function ProductPage({ params }) {
  const { id } = await params;
  const res = await fetch(`${BASE_URL}/api/products/${id}`, { cache: 'no-store' });
  if (!res.ok) notFound();
  const p = await res.json();
  return (
    <article className="card">
      <span className="badge">{p.brand}</span>
      <h1>{p.model}</h1>
      <ProductPhoto brand={p.brand} model={p.model} imageUrl={p.image ? getPb().files.getURL(p, p.image) : ''} large />
      <p className="price">€{Number(p.price).toFixed(2)}</p>
      <p>{p.description || 'No description.'}</p>
      <div className="actions">
        <Link className="btn secondary" href="/products">Back</Link>
        <Link className="btn" href={`/products/${p.id}/edit`}>Edit</Link>
        <DeleteButton id={p.id} redirectTo="/products" />
      </div>
    </article>
  );
}
