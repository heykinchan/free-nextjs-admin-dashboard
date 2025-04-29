"use client";

import React, { useEffect, useState } from "react";
import {
  fetchClients,
  fetchProducts,
  fetchSubscriptionsByClient,
  createSubscription,
  updateSubscription,
} from "@/lib/api";

export default function SubscriptionForm() {
  const [clients, setClients] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);

  const [productId, setProductId] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      const [clientsData, productsData] = await Promise.all([
        fetchClients(),
        fetchProducts(),
      ]);
      setClients(clientsData);
      setProducts(productsData);
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      async function loadSubscriptions() {
        const subs = await fetchSubscriptionsByClient(selectedClientId);
        setSubscriptions(subs);
      }
      loadSubscriptions();
    } else {
      setSubscriptions([]);
      setSelectedSubscriptionId(null);
    }
  }, [selectedClientId]);

  const handleSelectSubscription = (subscriptionId: number) => {
    const sub = subscriptions.find((s) => s.id === subscriptionId);
    if (sub) {
      setSelectedSubscriptionId(sub.id);
      setProductId(sub.productId);
      setCustomPrice(sub.customPrice || "");
      setStartDate(sub.startDate.substring(0, 10)); // trimming to YYYY-MM-DD
      setEndDate(sub.endDate.substring(0, 10));
      setStatus(sub.status);
    }
  };

  const handleResetForm = () => {
    setSelectedSubscriptionId(null);
    setProductId("");
    setCustomPrice("");
    setStartDate("");
    setEndDate("");
    setStatus("Active");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert("Please select a client first!");
      return;
    }

    setLoading(true);
    try {
      if (selectedSubscriptionId) {
        // Updating existing subscription
        await updateSubscription(selectedSubscriptionId, {
          startDate,
          endDate,
          status,
          customPrice: customPrice ? parseFloat(customPrice) : null,
        });
      } else {
        // Creating new subscription
        await createSubscription(selectedClientId, {
          productId: Number(productId),
          startDate,
          endDate,
          status,
          customPrice: customPrice ? parseFloat(customPrice) : null,
        });
      }

      handleResetForm();
      const updatedSubs = await fetchSubscriptionsByClient(selectedClientId);
      setSubscriptions(updatedSubs);
    } catch (error) {
      console.error("Error submitting subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">

      {/* Select Client */}
      <div>
        <label className="block text-sm font-medium mb-1">Select Client</label>
        <select
          value={selectedClientId || ""}
          onChange={(e) => setSelectedClientId(Number(e.target.value))}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">-- Select a Client --</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Select Existing Subscription */}
      {subscriptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">Select Existing Subscription (optional)</label>
          <select
            value={selectedSubscriptionId || ""}
            onChange={(e) => handleSelectSubscription(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Create New Subscription --</option>
            {subscriptions.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id} - {s.product?.name || "No Product"}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Select Product */}
      <div>
        <label className="block text-sm font-medium mb-1">Select Product</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required={!selectedSubscriptionId}
          className="w-full border border-gray-300 rounded px-3 py-2"
          disabled={selectedSubscriptionId !== null}
        >
          <option value="">-- Select a Product --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Form fields */}
      <div>
        <label className="block text-sm font-medium mb-1">Custom Price (optional)</label>
        <input
          type="number"
          value={customPrice}
          onChange={(e) => setCustomPrice(e.target.value)}
          step="0.01"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {loading
            ? "Submitting..."
            : selectedSubscriptionId
            ? "Update Subscription"
            : "Create Subscription"}
        </button>

        <button
          type="button"
          onClick={handleResetForm}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Clear
        </button>
      </div>

    </form>
  );
}