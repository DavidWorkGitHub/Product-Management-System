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

export async function readProduct(request) {
  const multipart = request.headers.get('content-type')?.startsWith('multipart/form-data');
  const body = multipart ? await request.formData() : await request.json();
  if (!multipart) return validate(body);

  const { errors, data } = validate(Object.fromEntries(body));
  const image = body.get('image');
  if (image !== null && (!(image instanceof File) || !image.size ||
      image.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(image.type))) {
    errors.push('Choose a JPG, PNG or WebP image up to 5 MB.');
  }
  if (errors.length || image === null) return { errors, data };

  const upload = new FormData();
  for (const [key, value] of Object.entries(data)) upload.set(key, String(value));
  upload.set('image', image);
  return { errors, data: upload };
}
