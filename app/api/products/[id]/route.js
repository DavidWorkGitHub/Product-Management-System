import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getPb, validate } from '@/lib/pb';

export async function GET(_req, { params }) {
  const { id } = await params;
  try {
    return NextResponse.json(await getPb().collection('products').getOne(id));
  } catch {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ errors: ['Invalid JSON'] }, { status: 400 }); }

  const { errors, data } = validate(body);
  if (errors.length) return NextResponse.json({ errors }, { status: 400 });

  try {
    const updated = await getPb().collection('products').update(id, data);
    revalidateTag('products');
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}

export async function DELETE(_req, { params }) {
  const { id } = await params;
  try {
    await getPb().collection('products').delete(id);
    revalidateTag('products');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}
