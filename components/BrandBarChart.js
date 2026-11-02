'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BrandBarChart({ counts }) {
  const data = {
    labels: Object.keys(counts),
    datasets: [{ label: 'Laptops in stock', data: Object.values(counts), backgroundColor: '#2563eb' }],
  };
  const options = { responsive: true, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } };
  return <Bar data={data} options={options} />;
}
