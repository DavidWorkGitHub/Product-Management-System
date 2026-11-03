import { describe, it, expect } from 'vitest';
import { validate } from '../lib/pb.js';

const product = { brand: 'Dell', model: 'Test', description: '' };

describe('price validation', () => {
  it.each(['   ', '\t', true, false, [], [10], {}, null, undefined, '', -1, Infinity])('rejects invalid price %j', (price) => {
    expect(validate({ ...product, price }).errors).toContain('Price must be a number of 0 or more.');
  });

  it.each([0, 0.01, 250, '250.50', ' 10 '])('accepts price %j', (price) => {
    const result = validate({ ...product, price });
    expect(result.errors).toEqual([]);
    expect(result.data.price).toBe(Number(price));
  });
});
