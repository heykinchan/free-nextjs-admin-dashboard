
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableProducts from "@/components/tables/BasicTableProducts";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Clients Table | TailAdmin - Next.js Dashboard Template",
  description: "This is the Basic Tables page for TailAdmin.",
};

export default function ProductsTable() {
  return (
    <div>
      <PageBreadcrumb pageTitle="List of Products" />
      <div className="space-y-6">

        <ComponentCard>
          <BasicTableProducts />
        </ComponentCard>

      </div>
    </div>
  );
}
