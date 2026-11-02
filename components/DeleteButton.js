'use client';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id, redirectTo }) {
  const router = useRouter();
  async function remove() {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  }
  return <button className="danger" onClick={remove}>Delete</button>;
}
