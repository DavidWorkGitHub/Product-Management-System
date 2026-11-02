'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id, redirectTo }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function remove() {
    if (deleting || !confirm('Delete this product?')) return;
    setDeleting(true);
    setError('');
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        setError('Could not delete this product. Please try again.');
        return;
      }
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Could not connect. Check your connection and try again.');
    } finally {
      setDeleting(false);
    }
  }

  return <div>
    <button type="button" className="danger" onClick={remove} disabled={deleting}>
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
    {error && <p role="alert">{error}</p>}
  </div>;
}
