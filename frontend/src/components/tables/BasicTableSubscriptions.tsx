"use client";

import { fetchSubscriptions } from "@/lib/api/subscriptions.api";
import React from "react";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";

export default function BasicTableSubscriptions() {
  const {
    data: subscriptions,
    page,
    totalPages,
    goNext,
    goPrev,
    loading,
  } = usePaginatedData(fetchSubscriptions, 10);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1450px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "Client",
                  "Product",
                  "Status",
                  "Term",
                  "Start Date",
                  "End Date",
                  "Unit Price",
                  "Discount",
                  "Final Price"
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
              {subscriptions.map((sub) => {
                const unitPrice = sub.product?.unitPrice ?? 0;
                const discount = sub.discount ?? 0;
                const finalPrice = unitPrice * (1 - discount / 100);

                return (
                  <TableRow key={sub.id}>
                    <TableCell className="px-5 py-4 text-start">{sub.client?.name || "—"}</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{sub.product?.name || "—"}</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{sub.status}</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{sub.term || "—"}</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{new Date(sub.startDate).toLocaleDateString()}</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{new Date(sub.endDate).toLocaleDateString()}</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">${unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                      {discount ? `${discount}%` : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                      ${finalPrice.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
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
