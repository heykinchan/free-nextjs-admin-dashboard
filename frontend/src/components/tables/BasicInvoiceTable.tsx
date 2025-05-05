"use client";

import React from "react";
import { fetchInvoices } from "@/lib/api/invoices.api";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";

export default function BasicInvoiceTable() {
  const {
    data: invoices,
    page,
    totalPages,
    loading,
    goNext,
    goPrev,
  } = usePaginatedData(fetchInvoices, 10);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1300px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "Ref No",
                  "Client",
                  "Product",
                  "Amount",
                  "Created By",
                  "Updated By",
                  "Service Period",
                  "Paid On",
                  "Created On",
                  "Updated On"
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
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="px-5 py-4 text-start">{invoice.refNo || "—"}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    {invoice.subscription?.client?.name || "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    {invoice.subscription?.product?.name || "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    ${invoice.amount?.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    {invoice.createdBy || "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    {invoice.updatedBy || "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    {invoice.serviceStart && invoice.serviceEnd
                      ? `${new Date(invoice.serviceStart).toLocaleDateString()} → ${new Date(invoice.serviceEnd).toLocaleDateString()}`
                      : "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    {invoice.payDate ? new Date(invoice.payDate).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    {invoice.createdOn ? new Date(invoice.createdOn).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    {invoice.updatedOn ? new Date(invoice.updatedOn).toLocaleDateString() : "—"}
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
