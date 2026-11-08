import Link from 'next/link';
import { getHomeText } from '@/lib/redis';

export const dynamic = 'force-dynamic'; // read from Redis on every load

export default async function Home() {
  const { text, source } = await getHomeText();
  return (
    <>
      <section className="card home-hero">
        <h1>{text.title}</h1>
        <p>{text.intro}</p>
        <ul>
          <li>{text.feature1}</li>
          <li>{text.feature2}</li>
          <li>{text.feature3}</li>
          <li>{text.feature4}</li>
        </ul>
        <div className="actions">
          <Link className="btn" href="/products">View products</Link>
          <Link className="btn secondary" href="/products/add">Add a product</Link>
        </div>
      </section>
      {/* Handy for the demo and screenshots: shows where the text came from */}
      <p data-testid="text-source"><span className="badge">Text source: {source}</span></p>
    </>
  );
}
