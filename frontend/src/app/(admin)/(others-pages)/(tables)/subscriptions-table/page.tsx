
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableSubscriptions from "@/components/tables/BasicTableSubscriptions"; // Subscriptions Table
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Tables | TailAdmin - Next.js Dashboard Template",
  description: "This is the Basic Tables page for TailAdmin.",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="List of Subscriptions" />
      <div className="space-y-6">

        <ComponentCard>
          <BasicTableSubscriptions />
        </ComponentCard>
      </div>
    </div>
  );
}
