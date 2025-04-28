
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne"; // Products Table
import BasicTableClients from "@/components/tables/BasicTableClients"; // Clients Table
import BasicTableSubscriptions from "@/components/tables/BasicTableSubscriptions"; // Subscriptions Table
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Clients Table | TailAdmin - Next.js Dashboard Template",
  description: "This is the Basic Tables page for TailAdmin.",
};

export default function ClientsTable() {
  return (
    <div>
      <PageBreadcrumb pageTitle="List of Clients" />
      <div className="space-y-6">

        <ComponentCard>
          <BasicTableClients />
        </ComponentCard>

      </div>
    </div>
  );
}
