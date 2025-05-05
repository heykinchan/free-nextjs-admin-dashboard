"use client";

import { usePaginatedData } from "@/hooks/usePaginatedData";
import { fetchProducts } from "@/lib/api/products.api";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";

export default function BasicTableProducts() {
  const {
    data: products,
    page,
    totalPages,
    goNext,
    goPrev,
    loading,
  } = usePaginatedData(fetchProducts, 10);

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1300px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "Name",
                  "Year",
                  "Unit Price",
                  "Unit Period",
                  "Description",
                  "Created By",
                  "Created On",
                  "Updated By",
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
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="px-5 py-4 text-start">{product.name}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{product.year}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">${product.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{product.unitPeriod}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{product.description || "—"}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{product.createdBy}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{new Date(product.createdOn).toLocaleDateString()}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{product.updatedBy || "—"}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">{product.updatedOn ? new Date(product.updatedOn).toLocaleDateString() : "—"}</TableCell>
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
