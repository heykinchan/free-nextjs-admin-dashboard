"use client";

import BasicProductForm from "@/components/form/BasicProductForm";

export default function ProductCreatePage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Create a Product</h1>
      <BasicProductForm mode="create" onSuccess={() => console.log("Product created")} />
    </div>
  );
}
