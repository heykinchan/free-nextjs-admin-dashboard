"use client";

import { usePaginatedData } from "@/lib/hooks/usePaginatedData";
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

export function BasicTableProducts() {
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Product Name</TableCell>
              <TableCell isHeader>Price</TableCell>
              <TableCell isHeader>Description</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center p-4">
        <Button onClick={goPrev} disabled={page === 1}>Previous</Button>
        <span>Page {page} of {totalPages}</span>
        <Button onClick={goNext} disabled={page === totalPages}>Next</Button>
      </div>
    </div>
  );
}
