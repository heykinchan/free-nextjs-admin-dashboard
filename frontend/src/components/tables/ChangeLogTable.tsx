"use client";

import { fetchChangeLogs } from "@/lib/api";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button"; // assuming you have a button component

export default function ChangeLogTable() {
  const [changeLogs, setChangeLogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 10 logs per page

  useEffect(() => {
    async function loadChangeLogs() {
      try {
        const data = await fetchChangeLogs();
        setChangeLogs(data);
      } catch (error) {
        console.error("Failed to load change logs:", error);
      }
    }

    loadChangeLogs();
  }, []);

  const totalPages = Math.ceil(changeLogs.length / pageSize);
  const displayedLogs = changeLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Action
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Details
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Time
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {displayedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="px-5 py-4 text-start">
                    {log.action}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    {log.details}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination buttons */}
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="text-gray-600 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}