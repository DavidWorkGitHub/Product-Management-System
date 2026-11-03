import PocketBase from 'pocketbase';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
export const getPb = () =>
  new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

// Shared validation used by both API routes (POST and PUT).
export function validate(body) {
  const errors = [];
  const brand = String(body?.brand ?? '').trim();
  const model = String(body?.model ?? '').trim();
  const description = String(body?.description ?? '').trim();
  const rawPrice = body?.price;
  const validPriceType = typeof rawPrice === 'number' ||
    (typeof rawPrice === 'string' && rawPrice.trim() !== '');
  const price = validPriceType ? Number(rawPrice) : NaN;

  if (!brand || brand.length > 100) errors.push('Brand is required (max 100 characters).');
  if (!model || model.length > 200) errors.push('Model is required (max 200 characters).');
  if (!Number.isFinite(price) || price < 0)
    errors.push('Price must be a number of 0 or more.');
  if (description.length > 2000) errors.push('Description is too long (max 2000 characters).');

  return { errors, data: { brand, model, price, description } };
}
