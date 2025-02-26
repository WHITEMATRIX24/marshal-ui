"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "appRevAreaName",
        header: " App Rev Area Name",

    },
    {
        accessorKey: "revAreaDetails",
        header: "Rev Area Details",
    },
    {
        accessorKey: "applicable",
        header: "Applicable",
    },
    {
        accessorKey: "justification",
        header: "Justification",
    },
]
