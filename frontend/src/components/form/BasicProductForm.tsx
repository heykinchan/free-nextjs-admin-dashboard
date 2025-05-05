"use client";

import React, { useEffect, useState } from "react";
import { createProduct, updateProduct } from "@/lib/api/products.api";
import Button from "@/components/ui/button/Button";

type Mode = "create" | "update";

export default function BasicProductForm() {
  const [mode, setMode] = useState<Mode>("create");

  const [product, setProduct] = useState<{
    id?: string;
    name: string;
    year: number;
    unitPrice: number;
    unitPeriod: "MONTHLY" | "ANNUALLY";
    description?: string;
    notes?: string;
  }>({
    name: "",
    year: new Date().getFullYear(),
    unitPrice: 0,
    unitPeriod: "MONTHLY",
    description: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Example: preload product when switching to update mode
  const preloadProduct = async () => {
    const mockProduct = {
      id: "abc-123",
      name: "Example Product",
      year: 2024,
      unitPrice: 199,
      unitPeriod: "ANNUALLY" as const,
      description: "Mock loaded product",
      notes: "From database",
    };
    setProduct(mockProduct);
  };

  useEffect(() => {
    if (mode === "update") preloadProduct();
    else
      setProduct({
        name: "",
        year: new Date().getFullYear(),
        unitPrice: 0,
        unitPeriod: "MONTHLY",
        description: "",
        notes: "",
      });
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...product,
      ...(mode === "create" ? { createdBy: "UI" } : { updatedBy: "UI" }),
    };

    try {
      if (mode === "create") {
        await createProduct(payload);
      } else if (mode === "update" && product.id) {
        await updateProduct(product.id, payload);
      }
      alert(`Product ${mode === "create" ? "created" : "updated"} successfully!`);
    } catch (err) {
      console.error(err);
      setError("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Tab Controls */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setMode("create")}
          className={`px-4 py-2 rounded ${mode === "create" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Create New
        </button>
        <button
          onClick={() => setMode("update")}
          className={`px-4 py-2 rounded ${mode === "update" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Update Existing
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            type="number"
            value={product.year}
            onChange={(e) => setProduct({ ...product, year: Number(e.target.value) })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (AUD)</label>
          <input
            type="number"
            value={product.unitPrice}
            onChange={(e) => setProduct({ ...product, unitPrice: Number(e.target.value) })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Billing Period</label>
          <select
            value={product.unitPeriod}
            onChange={(e) =>
              setProduct({ ...product, unitPeriod: e.target.value as "MONTHLY" | "ANNUALLY" })
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="ANNUALLY">Annually</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={product.notes}
            onChange={(e) => setProduct({ ...product, notes: e.target.value })}
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create Product" : "Update Product"}
        </Button>
      </form>
    </div>
  );
}
