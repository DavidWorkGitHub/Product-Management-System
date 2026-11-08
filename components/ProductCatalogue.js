'use client';
import { useState } from 'react';
import Link from 'next/link';
import ProductPhoto from './ProductPhoto';
import DeleteButton from './DeleteButton';

export default function ProductCatalogue({ products }) {
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState('name');
  const brands = [...new Set(products.map(p => p.brand))].sort();
  const visible = products.filter(p =>
    (!brand || p.brand === brand) &&
    `${p.brand} ${p.model} ${p.description || ''}`.toLowerCase().includes(query.trim().toLowerCase())
  ).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));

  return <div className="catalogue-layout">
    <aside className="card catalogue-controls" aria-label="Product filters">
      <h2>Filters</h2>
      <label>Search products<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Brand, model or description" /></label>
      <label>Brand<select value={brand} onChange={e => setBrand(e.target.value)}><option value="">All brands</option>{brands.map(b => <option key={b}>{b}</option>)}</select></label>
      <label>Sort by<select value={sort} onChange={e => setSort(e.target.value)}><option value="name">Name</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
    </aside>
    <section aria-label="Laptop results" className="catalogue-results">
    <p role="status" className="result-count">Showing {visible.length} of {products.length} products</p>
    {products.length === 0 ? <p>No products yet. <Link href="/products/add">Add one</Link>.</p> : visible.length === 0 && <div className="card"><p>No products match your filters.</p><button onClick={() => { setQuery(''); setBrand(''); }}>Clear filters</button></div>}
    <div className="grid">{visible.map(p => <article className="card" key={p.id}>
      <ProductPhoto brand={p.brand} model={p.model} imageUrl={p.imageUrl} />
      <span className="badge">{p.brand}</span><h2><Link href={`/products/${p.id}`}>{p.model}</Link></h2>
      <p className="price">€{Number(p.price).toFixed(2)}</p>
      <div className="actions"><Link className="btn" href={`/products/${p.id}`}>View</Link><Link className="btn secondary" href={`/products/${p.id}/edit`}>Edit</Link><DeleteButton id={p.id} /></div>
    </article>)}</div>
    </section>
  </div>;
}
