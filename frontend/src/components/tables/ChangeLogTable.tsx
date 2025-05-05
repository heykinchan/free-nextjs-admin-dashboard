"use client";

import { fetchChangeLogs } from "@/lib/api/changeLog.api";
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

export default function ChangeLogTable() {
  const {
    data: changeLogs,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setData,
  } = usePaginatedData();

  useEffect(() => {
    async function loadLogs() {
      try {
        const response = await fetchChangeLogs(currentPage, 10);
        setData(response);
      } catch (error) {
        console.error("Failed to load change logs:", error);
      }
    }

    loadLogs();
  }, [currentPage, setData]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Action", "Details", "Time"].map((header) => (
                  <TableCell key={header} isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {changeLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="px-5 py-4 text-start">{log.action}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{log.details}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{new Date(log.createdAt).toLocaleString()}</TableCell>
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
