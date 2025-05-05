
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicInvoiceTable from "@/components/tables/BasicInvoiceTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Invoices Table | TailAdmin - Next.js Dashboard Template",
};

export default function InvoicesTable() {
  return (
    <div>
      <PageBreadcrumb pageTitle="List of Invoices" />
      <div className="space-y-6">

        <ComponentCard>
          <BasicInvoiceTable />
        </ComponentCard>

      </div>
    </div>
  );
}
