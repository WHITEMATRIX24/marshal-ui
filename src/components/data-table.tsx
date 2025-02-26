"use client"
import * as React from "react"
import { Pencil, Trash } from "lucide-react"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [pageSize, setPageSize] = React.useState(10)
    const [pageIndex, setPageIndex] = React.useState(0)
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

    const table = useReactTable({
        data,
        columns: [
            ...columns, {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Pencil
                            className="h-4 w-4 text-black cursor-pointer"

                        />
                        <Trash
                            className="h-4 w-4 text-black cursor-pointer"

                        />
                    </div>
                ),
            },

        ],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onPaginationChange: (updater) => {
            const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater
            setPageIndex(newState.pageIndex)
        },
    })

    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
        setIsDropdownOpen(false)
        table.setPageSize(size)
    }

    const totalItems = table.getFilteredRowModel().rows.length
    const startItem = pageIndex * pageSize + 1
    const endItem = Math.min(startItem + pageSize - 1, totalItems)

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter lines..."
                    value={(table.getColumn("appRevAreaName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("appRevAreaName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            <Table className="w-full">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="bg-black text-white">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between py-4">
                {/* Items Per Page Dropdown */}
                <div className="flex items-center space-x-2 relative">
                    <span className="text-sm">Items per page</span>
                    <button
                        className="border px-2 py-1 rounded flex items-center"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {pageSize} ▼
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute bg-white border mt-1 rounded shadow-lg z-10">
                            {[10, 25, 50].map((size) => (
                                <button
                                    key={size}
                                    className="block w-full px-4 py-2 hover:bg-gray-100"
                                    onClick={() => handlePageSizeChange(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Page Summary and Controls */}
                <div className="flex items-center space-x-4 text-sm">
                    <span>
                        {startItem} - {endItem} of {totalItems}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {"<"}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {">"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
