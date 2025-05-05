"use client";

import { usePaginatedData } from "@/lib/hooks/usePaginatedData";
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

export function BasicTableClients() {
  const {
    data: clients,
    page,
    totalPages,
    goNext,
    goPrev,
    loading,
  } = usePaginatedData(fetchClients, 10);

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Client Name</TableCell>
              <TableCell isHeader>Email</TableCell>
              <TableCell isHeader>Subscriptions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.subscriptions?.length ?? 0}</TableCell>
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

