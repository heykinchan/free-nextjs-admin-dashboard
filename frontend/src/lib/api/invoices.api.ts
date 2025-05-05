const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchInvoices(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/invoices?${query}`);
  if (!res.ok) throw new Error("Failed to fetch invoices");

  return res.json(); // should include { data, page, totalPages }
}