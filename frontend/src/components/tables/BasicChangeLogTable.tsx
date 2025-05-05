"use client";

import { fetchChangeLogs } from "@/lib/api/changeLogs.api";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";

export default function BasicChangeLogTable() {
  const {
    data: changeLogs,
    page,
    totalPages,
    loading,
    goNext,
    goPrev,
  } = usePaginatedData(fetchChangeLogs, 10);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Type", "HubSpot Deal ID", "Action", "Details", "Action By", "Created At"].map((header) => (
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
              {changeLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{log.type}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{log.recordId}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{log.action}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{log.details}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{log.actionBy}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
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
