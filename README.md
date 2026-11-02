# Product Management System

Laptop catalogue built with **Next.js (App Router)**, **PocketBase**, **Redis**, **Chart.js** and **Recharts**.

## Setup
1. `npm install`
2. Download PocketBase (https://pocketbase.io), run `./pocketbase serve`, and create a superuser at http://127.0.0.1:8090/_/
3. Create a free Redis database at https://redis.io and copy its connection URL
4. `cp .env.local.example .env.local` and fill in the values
5. `npm run seed` (creates the `products` collection and 10 laptops: 4 Dell, 4 Lenovo, 2 Acer)
6. `npm run dev` then open http://localhost:3000

## Pages
| Route | Purpose |
|---|---|
| `/` | Home: all text is read from Redis |
| `/products` | List all products |
| `/products/add` | Add form |
| `/products/[id]` | View one product |
| `/products/[id]/edit` | Edit form |
| `/admin` | Bar graph (Chart.js) and line graph (Recharts) of laptops per brand |

API: `GET/POST /api/products`, `GET/PUT/DELETE /api/products/[id]`

## Redis cache (`lib/redis.js`)
All homepage text is stored as one JSON value under the key `home:text`. On load the page calls Redis `GET`. If the key is missing (first load) the defaults are written with `SET`. The page shows a small badge (`redis-hit` / `redis-miss` / `fallback`) so the cache working is visible in screenshots. If Redis is unreachable it falls back to default text instead of crashing.

## Optimisations
1. **Data caching with on-demand revalidation.** The products list fetches `/api/products` with `next: { tags: ['products'], revalidate: 60 }`, so Next.js serves it from its data cache. Every create, update and delete API route calls `revalidateTag('products')`, so the list is never stale after a change.
2. **Code splitting with dynamic imports.** Chart.js and Recharts are heavy, so `components/Charts.js` loads them with `next/dynamic` (`ssr: false`). They only download on `/admin`, keeping every other page's JavaScript small.
3. *(bonus)* `next/font` self-hosts Inter at build time (no external font request, no layout shift) and `compress: true` enables gzip.

## Graph types (A-grade)
- **Bar graph (Chart.js via react-chartjs-2):** compares separate categories. Each bar is one brand, and height shows quantity. It uses a `<canvas>`, and you register the pieces you need (scales, `BarElement`) so unused code is tree-shaken.
- **Line graph (Recharts):** joins points with a line, so it is best for trends over an ordered axis such as time. Here the x-axis is brand, so the line mainly shows the comparison; with a date field it would show change over time. Recharts renders **SVG** from declarative React components (`<LineChart>`, `<XAxis>`, `<Line>`).

## Tests
`npm run dev` in one terminal, `npm test` in another. See `tests/TEST_PLAN.md`. Save the output for your PDF with `npm test 2>&1 | tee tests/output.txt`.
