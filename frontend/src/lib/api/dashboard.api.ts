const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchDashboardMetrics() {
  const res = await fetch(`${API_URL}/dashboard/metrics`);
  if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
  return res.json();
}
