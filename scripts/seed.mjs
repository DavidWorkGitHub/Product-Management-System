// Creates the "products" collection (if missing) and adds 10 laptops: 4 Dell, 4 Lenovo, 2 Acer.
// Usage: npm run seed   (PocketBase must be running and .env.local filled in)
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');
await pb.collection('_superusers').authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD);

try {
  await pb.collections.getOne('products');
  console.log('Collection exists');
} catch {
  await pb.collections.create({
    name: 'products',
    type: 'base',
    listRule: '', viewRule: '', createRule: '', updateRule: '', deleteRule: '', // open for this assignment
    fields: [
      { name: 'brand', type: 'text', required: true },
      { name: 'model', type: 'text', required: true },
      { name: 'price', type: 'number', required: true },
      { name: 'description', type: 'text' },
    ],
  });
  console.log('Collection created');
}

const collection = await pb.collections.getOne('products');
if (!collection.fields.some(field => field.name === 'image')) {
  await pb.collections.update(collection.id, {
    fields: [...collection.fields, {
      name: 'image', type: 'file', maxSelect: 1, maxSize: 5 * 1024 * 1024,
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    }],
  });
  console.log('Product image field added');
}

const laptops = [
  ['Dell', 'XPS 13', 1199, 'Compact 13-inch ultrabook with an InfinityEdge display.'],
  ['Dell', 'XPS 15', 1799, '15-inch creator laptop with OLED option.'],
  ['Dell', 'Inspiron 15', 649, 'Reliable everyday laptop for home and study.'],
  ['Dell', 'Latitude 7440', 1449, 'Business laptop with strong security features.'],
  ['Lenovo', 'ThinkPad X1 Carbon', 1699, 'Lightweight business flagship with great keyboard.'],
  ['Lenovo', 'ThinkPad T14', 1099, 'Durable workhorse for professionals.'],
  ['Lenovo', 'IdeaPad 5', 599, 'Affordable all-rounder for students.'],
  ['Lenovo', 'Legion 5', 1299, 'Gaming laptop with high refresh rate display.'],
  ['Acer', 'Aspire 5', 549, 'Budget-friendly laptop for everyday tasks.'],
  ['Acer', 'Swift 3', 799, 'Thin and light laptop with long battery life.'],
];

const existing = await pb.collection('products').getFullList();
if (existing.length) {
  console.log(`Already ${existing.length} products, skipping seed`);
} else {
  for (const [brand, model, price, description] of laptops)
    await pb.collection('products').create({ brand, model, price, description });
  console.log('Seeded 10 laptops');
}
