"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useDispatch } from "react-redux";
import { showNewUserAddForm } from "@/lib/global-redux/features/uiSlice";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function UserManagementDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const dispatch = useDispatch();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pageSize, setPageSize] = React.useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handelOpenAddNewUserForm = () => dispatch(showNewUserAddForm(null));

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: { pageSize: pageSize },
    },
  });

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    table.setPageSize(size);
  };

  const startItem = table.getState().pagination.pageIndex * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, data.length);
  const totalItems = data.length;

  return (
    <div>
      <div className="flex justify-end gap-3 py-4">
        <Input
          placeholder="Search names..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm px-3 h-7 text-[11px] bg-[#f9fafb] dark:bg-[#e5e5e5]"
        />
        <div className="flex gap-5">
          <button
            className="bg-[var(--blue)] text-white text-[11px] px-2 py-1 rounded-[5px] ] dark:text-[black]"
            onClick={handelOpenAddNewUserForm}
          >
            Add New User
          </button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-[var(--purple)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`text-white text-[12px] h-7 p-1  ${
                      header.id === "actions" ? "text-center w-20" : ""
                    }
                    ${header.id === "is_active" ? "text-center w-20" : ""}
                    `}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`text-[11px] transition-colors hover:bg-[var(--hover-bg)] ${
                    index % 2 === 0
                      ? "bg-[var(--table-bg-even)] text-[black]"
                      : "bg-[var(--table-bg-odd)] text-[black]"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={`p-1 text-[11px] border-b`}
                        style={
                          cell.column.id === "is_active"
                            ? { textAlign: "center" }
                            : {}
                        }
                      >
                        {cell.column.id === "is_active" ? (
                          cell.getValue() ? (
                            <span>Active</span>
                          ) : (
                            <span>Inactive</span>
                          )
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="fixed bottom-[20px] w-[80%] flex items-center justify-between py-4 mr-4">
        <div className="flex items-center space-x-2 relative">
          <span className="text-[11px]">Items per page</span>
          <button
            className="border px-2 py-1 rounded flex justify-end text-[10px]"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {pageSize} ▼
          </button>
          {isDropdownOpen && (
            <div className="absolute top-[-60px] left-[60%] mt-1 bg-white border rounded shadow-lg z-10 text-[10px]">
              {[10, 25, 50].map((size) => (
                <button
                  key={size}
                  className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                  onClick={() => {
                    handlePageSizeChange(size);
                    setIsDropdownOpen(false);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 text-[10px]">
          <Button
            variant="outline"
            size="sm"
            className="text-[10px] text-[var(--blue)]"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <span>
            {startItem} - {endItem} of {totalItems}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-[10px] text-[var(--blue)]"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
        </div>
      </div>
    </div>
  );
}
