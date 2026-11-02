'use client';
import dynamic from 'next/dynamic';

// OPTIMISATION: charting libraries are large, so they're loaded only on /admin, and only in the browser.
const BrandBarChart = dynamic(() => import('./BrandBarChart'), { ssr: false, loading: () => <p>Loading chart…</p> });
const BrandLineChart = dynamic(() => import('./BrandLineChart'), { ssr: false, loading: () => <p>Loading chart…</p> });

export default function Charts({ counts }) {
  return (
    <>
      <section className="card">
        <h2>Bar graph (Chart.js)</h2>
        <BrandBarChart counts={counts} />
      </section>
      <section className="card">
        <h2>Line graph (Recharts)</h2>
        <BrandLineChart counts={counts} />
      </section>
    </>
  );
}
