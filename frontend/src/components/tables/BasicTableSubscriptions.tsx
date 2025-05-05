"use client";

import { fetchSubscriptions } from "@/lib/api/subscription.api";
import React, { useEffect } from "react";
import usePaginatedData from "@/hooks/usePaginatedData";
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
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setData,
  } = usePaginatedData();

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        const response = await fetchSubscriptions(currentPage, 10);
        setData(response);
      } catch (error) {
        console.error("Failed to load subscriptions:", error);
      }
    }
    loadSubscriptions();
  }, [currentPage, setData]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Client", "Product", "Status", "Start Date", "End Date", "Custom Price"].map((header) => (
                  <TableCell key={header} isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="px-5 py-4 text-start">{sub.client?.name}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{sub.product?.name}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{sub.status}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{new Date(sub.startDate).toLocaleDateString()}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{new Date(sub.endDate).toLocaleDateString()}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{sub.customPrice ? `$${sub.customPrice.toFixed(2)}` : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</Button>
        <span className="text-gray-600 text-sm">Page {currentPage} of {totalPages}</span>
        <Button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</Button>
      </div>
    </div>
  );
}
