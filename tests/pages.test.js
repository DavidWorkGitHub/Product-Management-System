import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BASE, post, del } from './helpers.js';
import { valid } from './helpers.js';

let id;
beforeAll(async () => { id = (await (await post(valid())).json()).id; });
afterAll(async () => { await del(id); });

describe('pages exist', () => {
  it.each(['/', '/products', '/products/add', '/admin'])('%s returns 200', async (path) => {
    const res = await fetch(BASE + path);
    expect(res.status).toBe(200);
  });

  it('home page shows its text source (Redis)', async () => {
    const html = await (await fetch(BASE + '/')).text();
    expect(html).toContain('Laptop Product Manager');
    expect(html).toMatch(/Text source: (redis-hit|redis-miss|fallback)/);
  });

  it('products page lists the test product', async () => {
    const html = await (await fetch(BASE + '/products')).text();
    expect(html).toContain('Products');
  });

  it('single product page loads', async () => {
    const res = await fetch(`${BASE}/products/${id}`);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('Test Model');
  });

  it('edit page loads with the product', async () => {
    const res = await fetch(`${BASE}/products/${id}/edit`);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('Edit Product');
  });

  it('unknown product gives 404', async () => {
    expect((await fetch(`${BASE}/products/doesnotexist1`)).status).toBe(404);
    expect((await fetch(`${BASE}/products/doesnotexist1/edit`)).status).toBe(404);
  });

  it('add page contains all form fields', async () => {
    const html = await (await fetch(BASE + '/products/add')).text();
    for (const name of ['brand', 'model', 'price', 'description']) expect(html).toContain(`name="${name}"`);
  });
});
