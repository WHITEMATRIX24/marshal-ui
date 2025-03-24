"use client";

import { Control } from "@/models/control";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Control, unknown>[] = [
  {
    accessorKey: "control_full_name",
    header: "App Rev Area Name",
    id: "control_full_name",
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