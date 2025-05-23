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
import { useDispatch, useSelector } from "react-redux";
import { showNewUserAddForm } from "@/lib/global-redux/features/uiSlice";
import formatRolesAndGov from "@/utils/format_roles_and_gov";
import { RootState } from "@/lib/global-redux/store";
import Cookies from "js-cookie";
import { saveAs } from "file-saver";
import axios from "axios";
import { formatName } from "@/utils/formater";
import { FileSpreadsheet, UserPlus } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function UserManagementDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const dispatch = useDispatch();
  const token = Cookies.get("access_token");
  const governanceData = useSelector(
    (state: RootState) => state.RolesAndGovernance.allGovernance
  );

  const rolesData = useSelector(
    (state: RootState) => state.RolesAndGovernance.allRoles
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pageSize, setPageSize] = React.useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

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

  const handelOpenAddNewUserForm = () => dispatch(showNewUserAddForm(null));

  // export handler
  const handleExport = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/users/export/excel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "arraybuffer",
        }
      );

      if (response.status === 200) {
        const file = new Blob([response?.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(file, `user_data.xlsx`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-end gap-3 py-1">
        <Input
          placeholder="Search Names..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm px-3 h-7 text-[11px] bg-[#f9fafb] dark:bg-[#e5e5e5]"
        />
        <div className="flex gap-3">
          <button

            onClick={handelOpenAddNewUserForm}
            className="bg-[#0890CA] text-white text-[11px] px-3 py-1 rounded-[5px] dark:bg-[#6BC1E6] dark:text-[black] flex items-center gap-1"
          >
            <UserPlus size={14} />
            New User
          </button>
          <button
            onClick={handleExport}
            className="bg-[#0890CA] text-white text-[11px] px-3 py-1 rounded-[5px] dark:bg-[#6BC1E6] dark:text-[black] flex items-center gap-1"
          >
            <FileSpreadsheet size={14} />
            Export
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
                    className={`text-white text-[12px] h-7 p-1  ${header.id === "actions" ? "text-center w-20" : ""
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
                  className={`text-[11px] transition-colors hover:bg-[var(--hover-bg)] ${index % 2 === 0
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
                        ) : cell.column.id === "gov_id" ? (
                          formatRolesAndGov({
                            govId: cell.getValue(),
                            governanceData: governanceData,
                          })
                        ) : cell.column.id === "link_to_role_id" ? (
                          formatRolesAndGov({
                            roleId: cell.getValue(),
                            rolesData: rolesData,
                          })
                        ) : cell.column.id === "username" ? (
                          formatName(cell.getValue())
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
