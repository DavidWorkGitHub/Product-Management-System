'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Used by both the Add and Edit pages. If `product` is passed, it updates; otherwise it creates.
export default function ProductForm({ product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    brand: product?.brand ?? 'Dell',
    model: product?.model ?? '',
    price: product?.price ?? '',
    description: product?.description ?? '',
  });
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setErrors([]);
    try {
      const image = e.currentTarget.elements.image.files[0];
      const body = new FormData();
      for (const [key, value] of Object.entries(form)) body.set(key, value);
      if (image) body.set('image', image);
      const res = await fetch(product ? `/api/products/${product.id}` : '/api/products', {
        method: product ? 'PUT' : 'POST',
        body,
      });
      if (res.ok) {
        router.push('/products');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors(data.errors || [data.error || 'Could not save the product. Please try again.']);
      }
    } catch {
      setErrors(['Could not connect. Check your connection and try again.']);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="card form">
      {errors.length > 0 && (
        <ul className="errors" role="alert">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
      )}
      <label>Brand
        <input name="brand" list="brands" value={form.brand} onChange={change} required />
        <datalist id="brands"><option value="Dell" /><option value="Lenovo" /><option value="Acer" /></datalist>
      </label>
      <label>Model
        <input name="model" value={form.model} onChange={change} required />
      </label>
      <label>Price (€)
        <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={change} required />
      </label>
      <label>Description
        <textarea name="description" rows="4" value={form.description} onChange={change} />
      </label>
      <label>{product?.image ? 'Replace photo (optional)' : 'Add photo (optional)'}
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp" />
        <small>JPG, PNG or WebP, up to 5 MB.</small>
      </label>
      <button type="submit" disabled={saving}>{saving ? 'Saving…' : product ? 'Update product' : 'Add product'}</button>
    </form>
  );
}
