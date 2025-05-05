const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchSubscriptions(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/subscriptions?${query}`);
  if (!res.ok) throw new Error('Failed to fetch subscriptions');
  return res.json();
}

export async function fetchSubscriptionById(id: string) {
  const res = await fetch(`${API_URL}/subscriptions/${id}`);
  if (!res.ok) throw new Error('Failed to fetch subscription');
  return res.json();
}

export async function createSubscription(clientId: string, data: any) {
  const res = await fetch(`${API_URL}/subscriptions/client/${clientId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create subscription');
  return res.json();
}

export async function updateSubscription(id: string, data: any) {
  const res = await fetch(`${API_URL}/subscriptions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update subscription');
  return res.json();
}

export async function deleteSubscription(id: string) {
  const res = await fetch(`${API_URL}/subscriptions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete subscription');
  return res.json();
}
