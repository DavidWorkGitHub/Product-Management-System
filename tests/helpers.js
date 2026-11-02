export const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const post = (body) =>
  fetch(`${BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

export const del = (id) => fetch(`${BASE}/api/products/${id}`, { method: 'DELETE' });
export const getOne = (id) => fetch(`${BASE}/api/products/${id}`);
export const valid = (over = {}) => ({ brand: 'TestBrand', model: 'Test Model', price: 999, description: 'Test desc', ...over });
