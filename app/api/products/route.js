import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getPb, readProduct } from '@/lib/pb';

export async function GET() {
  try {
    const items = await getPb().collection('products').getFullList({ sort: 'brand,model' });
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: 'Could not load products' }, { status: 500 });
  }
}

export async function POST(request) {
  let input;
  try { input = await readProduct(request); }
  catch { return NextResponse.json({ errors: ['Invalid request body'] }, { status: 400 }); }

  const { errors, data } = input;
  if (errors.length) return NextResponse.json({ errors }, { status: 400 });

  try {
    const created = await getPb().collection('products').create(data);
    revalidateTag('products');
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not create product' }, { status: 500 });
  }
}
