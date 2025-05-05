const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchChangeLogs(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/changelogs?${query}`);
  if (!res.ok) throw new Error('Failed to fetch change logs');

  return res.json();
}
