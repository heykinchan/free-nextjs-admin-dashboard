const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'; // fallback just in case

// --------- Clients ---------
export async function fetchClients() {
  const res = await fetch(`${API_URL}/clients`);
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
}

export async function createClient(data: { name: string; email: string }) {
  const res = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create client');
  return res.json();
}

export async function updateClient(id: number, data: { name: string; email: string }) {
  const res = await fetch(`${API_URL}/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update client');
  return res.json();
}

export async function deleteClient(id: number) {
  const res = await fetch(`${API_URL}/clients/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete client');
  return res.json();
}

// --------- Products ---------
export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function createProduct(data: { name: string; price: number; description: string }) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id: number, data: { name: string; price: number; description: string }) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

// --------- Subscriptions ---------
export async function createSubscription(clientId: number, data: { productId: number; startDate: string; endDate: string; status: string }) {
  const res = await fetch(`${API_URL}/subscriptions/client/${clientId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create subscription');
  return res.json();
}

export async function updateSubscription(id: number, data: { startDate: string; endDate: string; status: string }) {
  const res = await fetch(`${API_URL}/subscriptions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update subscription');
  return res.json();
}

export async function deleteSubscription(id: number) {
  const res = await fetch(`${API_URL}/subscriptions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete subscription');
  return res.json();
}

// --------- Dashboard ---------
export async function fetchDashboardStats() {
  const res = await fetch(`${API_URL}/dashboard-stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}
