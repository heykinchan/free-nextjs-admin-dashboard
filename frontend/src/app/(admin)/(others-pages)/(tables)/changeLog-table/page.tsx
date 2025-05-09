
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicChangeLogTable from "@/components/tables/BasicChangeLogTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Clients Table | TailAdmin - Next.js Dashboard Template",
  description: "This is the Basic Tables page for TailAdmin.",
};

export default function ChangeLogsTable() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Change Logs" />
      <div className="space-y-6">

        <ComponentCard>
          <BasicChangeLogTable />
        </ComponentCard>

      </div>
    </div>
  );
}
