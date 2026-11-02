'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BrandLineChart({ counts }) {
  const data = Object.entries(counts).map(([brand, quantity]) => ({ brand, quantity }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="brand" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="quantity" stroke="#16a34a" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
