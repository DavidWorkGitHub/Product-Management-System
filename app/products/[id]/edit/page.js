import { notFound } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { BASE_URL } from '@/lib/pb';

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const res = await fetch(`${BASE_URL}/api/products/${id}`, { cache: 'no-store' });
  if (!res.ok) notFound();
  const product = await res.json();
  return (
    <>
      <h1>Edit Product</h1>
      <ProductForm product={product} />
    </>
  );
}
