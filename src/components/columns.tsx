"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    ctrl_name: string
    revAreaDetails: string
    applicable: string
    justification: string
    subRows?: Payment[] // Ensure subRows is optional to avoid errors
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "appRevAreaName",
        header: "App Rev Area Name",
        id: "appRevAreaName",
    },
    {
        accessorKey: "applicable",
        header: "Applicable",
        id: "applicable",
    },
    {
        accessorKey: "justification",
        header: "Justification",
        id: "justification",
    },
];

