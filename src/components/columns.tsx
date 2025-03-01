"use client";

import { Control } from "@/models/control";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Control, unknown>[] = [
  {
    accessorKey: "ctrl_name",
    header: "App Rev Area Name",
    id: "ctrl_name",
  },
  {
    accessorKey: "applicable",
    header: "Applicable",
    id: "applicable",
    cell: ({ row }) => (row.original.applicable ? "Yes" : "No"),
  },
  {
    accessorKey: "justification",
    header: "Justification",
    id: "justification",
  },
];
