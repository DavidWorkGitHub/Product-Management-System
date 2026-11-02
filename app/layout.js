import './globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';

// OPTIMISATION: next/font self-hosts the font at build time (no extra network request, no layout shift).
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = { title: 'Laptop Product Manager', description: 'Manage laptop products' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/products/add">Add Product</Link>
          <Link href="/admin">Admin</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
