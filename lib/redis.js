import Redis from 'ioredis';

const KEY = 'home:text';

// Default homepage text. It is written to Redis the first time the page loads.
const DEFAULT_TEXT = {
  title: 'Laptop Product Manager',
  intro: 'A simple app for managing a catalogue of laptops. Add, view, edit and delete products stored in PocketBase.',
  feature1: 'Browse every laptop in the catalogue',
  feature2: 'Add new laptops with a simple form',
  feature3: 'Edit or delete existing products',
  feature4: 'View stock charts on the admin page',
};

let client;
function getClient() {
  if (!process.env.REDIS_URL) return null;
  if (!client) {
    client = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true });
    client.on('error', () => {}); // avoid crashing if Redis is unreachable
  }
  return client;
}

// Returns { text, source } where source is 'redis-hit', 'redis-miss' or 'fallback'.
export async function getHomeText() {
  const redis = getClient();
  if (!redis) return { text: DEFAULT_TEXT, source: 'fallback' };
  try {
    const cached = await redis.get(KEY);
    if (cached) return { text: JSON.parse(cached), source: 'redis-hit' };
    await redis.set(KEY, JSON.stringify(DEFAULT_TEXT));
    return { text: DEFAULT_TEXT, source: 'redis-miss' };
  } catch {
    return { text: DEFAULT_TEXT, source: 'fallback' };
  }
}
