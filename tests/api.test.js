import { describe, it, expect } from 'vitest';
import { BASE, post, del, getOne, valid } from './helpers.js';

describe('seed data', () => {
  it('has 10 laptops: 4 Dell, 4 Lenovo, 2 Acer', async () => {
    const items = await (await fetch(`${BASE}/api/products`)).json();
    const count = (b) => items.filter((p) => p.brand === b).length;
    expect(count('Dell')).toBe(4);
    expect(count('Lenovo')).toBe(4);
    expect(count('Acer')).toBe(2);
  });
});

describe('CRUD', () => {
  it('create -> read -> update -> delete', async () => {
    // Create
    const created = await post(valid());
    expect(created.status).toBe(201);
    const { id } = await created.json();

    // Data exists in the database
    const read = await (await getOne(id)).json();
    expect(read).toMatchObject({ brand: 'TestBrand', model: 'Test Model', price: 999 });

    // Update
    const upd = await fetch(`${BASE}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(valid({ model: 'Changed', price: 123.45 })),
    });
    expect(upd.status).toBe(200);
    const after = await (await getOne(id)).json();
    expect(after.model).toBe('Changed');
    expect(after.price).toBe(123.45);

    // Delete
    expect((await del(id)).status).toBe(200);
    expect((await getOne(id)).status).toBe(404);
  });

  it('deleting a missing product returns 404', async () => {
    expect((await del('doesnotexist1')).status).toBe(404);
  });

  it('updating a missing product returns 404', async () => {
    const res = await fetch(`${BASE}/api/products/doesnotexist1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(valid()),
    });
    expect(res.status).toBe(404);
  });
});
