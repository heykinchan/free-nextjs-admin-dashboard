"use client";

import { usePaginatedData } from "@/hooks/usePaginatedData";
import { fetchClients } from "@/lib/api/clients.api";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";

export default function BasicTableClients() {
  const {
    data: clients,
    page,
    totalPages,
    goNext,
    goPrev,
    loading,
  } = usePaginatedData(fetchClients, 10);

  return (
    <div className="overflow-hidden rounded-xl border bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>{[
                  "Client Name",
                  "CRM ID",
                  "Domain",
                  "Notes",
                  "# of Subscriptions"
                  ].map((header) => (
                  <TableCell
                  key={header}
                  isHeader
                  className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="px-5 py-4 text-start">{client.name || "—"}</TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                  {client.crmId || "—"}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                  {client.domain || "—"}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                  {client.notes || "—"}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                  {client.subscriptions?.length ?? 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
    <div className="flex justify-between items-center mt-4 px-4">
      <Button onClick={goPrev} disabled={page === 1 || loading}>Previous</Button>
      <span className="text-gray-600 text-sm">Page {page} of {totalPages}</span>
      <Button onClick={goNext} disabled={page === totalPages || loading}>Next</Button>
    </div>
  </div>
  );
}
