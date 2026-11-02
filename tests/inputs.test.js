import { describe, it, expect } from 'vitest';
import { post, del, getOne, valid } from './helpers.js';

// Strings that should be ACCEPTED and stored exactly as given (after trimming).
const acceptable = {
  'short (1 char)': 'A',
  'long (200 chars)': 'x'.repeat(200),
  'numbers as text': '12345',
  'wildcards': '%_*?',
  'SQL-style': "'; DROP TABLE products; --",
  'HTML / script': '<script>alert(1)</script>',
  'unicode': 'Ünïcødé ñ 日本語',
  'emoji': '💻🔥',
  'quotes & slashes': `"quoted" \\ / 'single'`,
};

describe('model field accepts varied strings', () => {
  it.each(Object.entries(acceptable))('%s', async (_name, value) => {
    const res = await post(valid({ model: value }));
    expect(res.status).toBe(201);
    const { id } = await res.json();
    expect((await (await getOne(id)).json()).model).toBe(value);
    await del(id);
  });
});

describe('invalid input is rejected with 400', () => {
  it.each([
    ['empty brand', { brand: '' }],
    ['whitespace brand', { brand: '   ' }],
    ['empty model', { model: '' }],
    ['model too long (201)', { model: 'x'.repeat(201) }],
    ['brand too long (101)', { brand: 'x'.repeat(101) }],
    ['description too long', { description: 'x'.repeat(2001) }],
    ['negative price', { price: -5 }],
    ['text price', { price: 'abc' }],
    ['empty price', { price: '' }],
    ['null price', { price: null }],
    ['infinite price', { price: 'Infinity' }],
  ])('%s', async (_name, override) => {
    const res = await post(valid(override));
    expect(res.status).toBe(400);
    expect((await res.json()).errors.length).toBeGreaterThan(0);
  });

  it('invalid JSON body', async () => {
    expect((await post('{not json')).status).toBe(400);
  });

  it('completely empty object', async () => {
    const res = await post({});
    expect(res.status).toBe(400);
    expect((await res.json()).errors.length).toBeGreaterThanOrEqual(3);
  });
});

describe('price edge cases accepted', () => {
  it.each([[0], [0.01], [99999.99], ['250.50']])('price %s', async (price) => {
    const res = await post(valid({ price }));
    expect(res.status).toBe(201);
    await del((await res.json()).id);
  });

  it('empty description is allowed', async () => {
    const res = await post(valid({ description: '' }));
    expect(res.status).toBe(201);
    await del((await res.json()).id);
  });
});
