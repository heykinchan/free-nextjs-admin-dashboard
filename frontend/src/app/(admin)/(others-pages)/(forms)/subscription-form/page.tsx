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
  const [products, setProducts] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const [tab, setTab] = useState<"create" | "update">("create");

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null);
  const [createdSubscription, setCreatedSubscription] = useState<any | null>(null);

  const [productId, setProductId] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const [clientList, productList] = await Promise.all([
        fetchClients(),
        fetchProducts(),
      ]);
      setClients(clientList);
      setProducts(productList);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchSubscriptionsByClient(selectedClientId).then((subs) => setSubscriptions(subs));
    } else {
      setSubscriptions([]);
      setSelectedSubscriptionId(null);
      setSelectedSubscription(null);
    }
  }, [selectedClientId]);

  const handleSelectSubscription = (id: number) => {
    const found = subscriptions.find((s) => s.id === id);
    if (found) {
      setSelectedSubscriptionId(id);
      setSelectedSubscription(found);
      setProductId(found.productId.toString());
      setCustomPrice(found.customPrice || "");
      setStartDate(found.startDate.substring(0, 10));
      setEndDate(found.endDate.substring(0, 10));
      setStatus(found.status);
    }
  };

  const handleResetForm = () => {
    setSelectedSubscriptionId(null);
    setSelectedSubscription(null);
    setCreatedSubscription(null);
    setProductId("");
    setCustomPrice("");
    setStartDate("");
    setEndDate("");
    setStatus("Active");
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClientId) {
      alert("Please select a client first!");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setCreatedSubscription(null);

    try {
      if (tab === "update" && selectedSubscriptionId) {
        await updateSubscription(selectedSubscriptionId, {
          startDate,
          endDate,
          status,
          customPrice: customPrice ? parseFloat(customPrice) : null,
        });

        const updatedList = await fetchSubscriptionsByClient(selectedClientId);
        setSubscriptions(updatedList);
        const updatedSub = updatedList.find((s) => s.id === selectedSubscriptionId);
        setSelectedSubscription(updatedSub);
        setMessage("Subscription updated successfully.");
      } else {
        const newSub = await createSubscription(selectedClientId, {
          productId: Number(productId),
          startDate,
          endDate,
          status,
          customPrice: customPrice ? parseFloat(customPrice) : null,
        });
        setCreatedSubscription(newSub);
        const refreshed = await fetchSubscriptionsByClient(selectedClientId);
        setSubscriptions(refreshed);
        setMessage("Subscription created successfully.");
      }
    } catch (err) {
      console.error("Error submitting subscription:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Tabs */}
      <div className="flex mb-4 gap-4">
        <button
          className={`px-4 py-2 rounded ${tab === "create" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => {
            setTab("create");
            handleResetForm();
          }}
        >
          Create Subscription
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "update" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => {
            setTab("update");
            handleResetForm();
          }}
        >
          Update Subscription
        </button>
      </div>

      {/* Feedback Messages */}
      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Selection */}
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

        {/* Conditional for Update */}
        {tab === "update" && subscriptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1">Select Subscription to Update</label>
            <select
              value={selectedSubscriptionId || ""}
              onChange={(e) => handleSelectSubscription(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">-- Select a Subscription --</option>
              {subscriptions.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} - {s.product?.name || "No Product"}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Product selection (Create only) */}
        {tab === "create" && (
          <div>
            <label className="block text-sm font-medium mb-1">Select Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">-- Select a Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Common Fields */}
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

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-green-700"
          >
            {loading
              ? "Submitting..."
              : tab === "create"
              ? "Create Subscription"
              : "Update Subscription"}
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

      {/* Summary */}
      {(createdSubscription || selectedSubscription) && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Subscription Summary</h3>
          <p><strong>Client:</strong> {clients.find((c) => c.id === selectedClientId)?.name}</p>
          <p><strong>Product:</strong> {products.find((p) => p.id === Number(productId))?.name}</p>
          <p><strong>Price:</strong> ${customPrice || "Default"}</p>
          <p><strong>Start Date:</strong> {startDate}</p>
          <p><strong>End Date:</strong> {endDate}</p>
          <p><strong>Status:</strong> {status}</p>
        </div>
      )}
    </div>
  );
}
