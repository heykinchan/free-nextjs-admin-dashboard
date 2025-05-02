"use client";

import React, { useEffect, useState } from "react";
import { createProduct, updateProduct, fetchProducts } from "@/lib/api";

export default function ProductForm() {
  const [products, setProducts] = useState<any[]>([]);
  const [tab, setTab] = useState<"create" | "update">("create");

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdProduct, setCreatedProduct] = useState<any | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);

  const handleSelectProduct = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProductId(product.id);
      setSelectedProduct(product);
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
    } else {
      setSelectedProduct(null);
    }
  };

  const handleReset = () => {
    setSelectedProductId(null);
    setSelectedProduct(null);
    setCreatedProduct(null);
    setName("");
    setPrice("");
    setDescription("");
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setCreatedProduct(null);

    try {
      if (tab === "update" && selectedProductId) {
        const updated = {
          id: selectedProductId,
          name,
          price: Number(price),
          description,
        };
        await updateProduct(selectedProductId, updated);
        const updatedList = await fetchProducts();
        setProducts(updatedList);

        const refreshed = updatedList.find((p) => p.id === selectedProductId);
        setSelectedProduct(refreshed);
        setMessage("Product updated successfully.");
      } else if (tab === "create") {
        const newProduct = { name, price: Number(price), description };
        const result = await createProduct(newProduct);
        setCreatedProduct(result);
        const refreshedList = await fetchProducts();
        setProducts(refreshedList);
        setMessage("Product created successfully.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
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
      <div className="flex mb-4 space-x-4">
        <button
          className={`px-4 py-2 rounded ${tab === "create" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => {
            setTab("create");
            handleReset();
          }}
        >
          Create Product
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "update" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => {
            setTab("update");
            handleReset();
          }}
        >
          Update Product
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

      {/* Create Form */}
      {tab === "create" && (
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                step="0.01"
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {loading ? "Creating..." : "Create Product"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </form>

          {/* Created Product Summary */}
          {createdProduct && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Created Product Summary</h3>
              <p><strong>Name:</strong> {createdProduct.name}</p>
              <p><strong>Price:</strong> ${createdProduct.price.toFixed(2)}</p>
              <p><strong>Description:</strong> {createdProduct.description}</p>
            </div>
          )}
        </>
      )}

      {/* Update Form */}
      {tab === "update" && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Select Product to Update</label>
            <select
              value={selectedProductId || ""}
              onChange={(e) => handleSelectProduct(Number(e.target.value))}
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

          {selectedProduct && (
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {/* Updated Product Summary */}
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-semibold mb-2">Current Product Info</h3>
                <p><strong>Name:</strong> {selectedProduct.name}</p>
                <p><strong>Price:</strong> ${selectedProduct.price.toFixed(2)}</p>
                <p><strong>Description:</strong></p>
                <p className="whitespace-pre-wrap">{selectedProduct.description}</p>
              </div>

              {/* Edit Form */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">New Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">New Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">New Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {loading ? "Updating..." : "Update Product"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
