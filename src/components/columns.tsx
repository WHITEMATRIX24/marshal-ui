"use client";

import { Control } from "@/models/control";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Control, unknown>[] = [
  {
    accessorKey: "ctrl_name",
    header: "App Rev Area Name",
    id: "ctrl_name",
  },
  {
    accessorKey: "applicable_str",
    header: "Applicable",
    id: "applicable_str",

  },
  {
    accessorKey: "justification",
    header: "Justification",
    id: "justification",
  },
];