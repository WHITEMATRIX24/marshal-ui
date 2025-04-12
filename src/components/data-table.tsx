"use client";
import * as React from "react";
import { Pencil, Trash, ChevronDown, ChevronUp, X } from "lucide-react";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Cookies from "js-cookie";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateControlsApi } from "@/services/apis";
import DeleteModal from "./deleteControlModal";
import { Task } from "@/models/control";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onEdit?: (updatedRow: TData) => void;
  onDelete?: (deletedCtrlId: number) => void;
  onRowExpand?: (row: TData) => void;
}

export function DataTable<
  TData extends {
    id: number;
    children?: TData[];
    applicable_str?: string;
    tasks?: Task[];
  },
  TValue
>({ columns, data, onEdit, onDelete }: DataTableProps<TData, TValue>) {
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [expandedRows, setExpandedRows] = React.useState<
    Record<string, boolean>
  >({});

  const [searchQuery, setSearchQuery] = React.useState("");
  const [role, setRole] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data);
  const [editingRow, setEditingRow] = React.useState<TData | null>(null);
  const [deletingCtrlId, setDeletingCtrlId] = React.useState<number | null>(
    null
  );
  const [applicableValue, setApplicableValue] = React.useState("");
  const [justificationValue, setJustificationValue] = React.useState("");
  const govId = Cookies.get("selected_governance");
  React.useEffect(() => {
    if (govId) {
      const parsedGovId = JSON.parse(govId);
      setRole(parsedGovId.role_name);
    }
  }, [govId]);
  // Search
  React.useEffect(() => {
    const filterNestedData = (rows: TData[]): TData[] => {
      return rows
        .map((row) => ({
          ...row,
          children: row.children ? filterNestedData(row.children) : [],
        }))
        .filter((row) => {
          const rowMatches = Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          );
          const childrenMatch = row.children?.length > 0;
          return rowMatches || childrenMatch;
        });
    };
    setFilteredData(filterNestedData(data));
  }, [searchQuery, data]);

  // const flattenDataForExport = (data: TData[]): any[] => {
  //   const flatten = (items: TData[]): any[] => {
  //     return items.flatMap((item) => {
  //       const { children, ...rest } = item as any;
  //       const flattenedItem = { ...rest };
  //       const subItems = children ? flatten(children) : [];
  //       return [flattenedItem, ...subItems];
  //     });
  //   };

  //   return flatten(data);
  // };

  // const handleExportCSV = () => {
  //   const exportData = flattenDataForExport(filteredData);
  //   const csv = Papa.unparse(exportData);
  //   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  //   saveAs(blob, "exported_data.csv");
  // };

  const toggleRow = (rowId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };
  const table = useReactTable({
    data: filteredData,
    columns: [
      ...columns,
      {
        id: "actions",
        header: () => (
          <span className="text-right w-full block px-4">Actions</span>
        ),
        cell: ({ row }) => (
          <div className="flex space-x-2 justify-end">
            <Pencil
              className="h-4 w-4 text-black cursor-pointer"
              onClick={() => {
                console.log("Editing row ID:", row.original.id); // Add this line
                setEditingRow(row.original);
                setApplicableValue((row.original as any).applicable);
                setJustificationValue((row.original as any).justification);
              }}
            />
            {/* <Trash className="h-4 w-4 text-[var(--red)] cursor-pointer" /> */}
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
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
    },
  });
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setIsDropdownOpen(false);
    table.setPageSize(size);
  };

  const updateControl = async (ctrlId: number, updatedData: any) => {
    const token = Cookies.get("access_token");
    console.log("updating", updatedData);
    try {
      const response = await updateControlsApi({
        method: "PUT",
        urlEndpoint: `/controls/${ctrlId}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: updatedData,
      });

      if (!response?.data) {
        throw new Error("Failed to update control");
      }

      return response.data;
    } catch (error) {
      console.error("Error updating control:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow?.id) {
      // Add null check
      console.error("No row ID found for editing");
      return;
    }
    console.log("Submitting Edit:", editingRow);
    if (editingRow && onEdit) {
      const updatedRow = {
        ...editingRow,
        is_applicable: applicableValue === "Yes",
        applicable_str: applicableValue,
        justification: justificationValue,
      };

      try {
        const response = await updateControl(editingRow.id, updatedRow);
        console.log("Control updated successfully:", response);

        // Call the onEdit callback to update the local state
        onEdit(updatedRow);

        // Close the edit modal
        setEditingRow(null);
      } catch (error) {
        console.error("Error updating control:", error);
      }
    }
  };

  const openEditModal = (row: TData) => {
    setEditingRow(row);
    setApplicableValue((row as any).is_applicable ? "Yes" : "No");
    setJustificationValue((row as any).justification || "");
  };

  const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);

  const renderRows = (rows: TData[], level: number = 0) => {
    const paginatedRows =
      level === 0
        ? rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
        : rows;

    return paginatedRows.map((row, index) => {
      const isLeafNode = !row.children || row.children.length === 0;
      return (
        <React.Fragment key={`row-${row.id}`}>
          <TableRow
            key={`row-${row.id}`}
            className={`transition-colors hover:bg-[var(--hover-bg)] ${expandedRows[row.id]
              ? "bg-[var(--hover-bg)]"
              : index % 2 === 0
                ? "bg-[var(--table-bg-even)] text-black"
                : "bg-[var(--table-bg-odd)] text-black"
              }`}
          >
            {columns.map((column, colIndex) => (
              <TableCell
                key={`cell-${row.id}-${column.id}`}
                className={`text-[11px] px-2 py-1 ${colIndex === 1
                  ? "w-[50px] text-center"
                  : colIndex === 2
                    ? "max-w-[350px] break-words"
                    : "flex-1"
                  }`}
              >
                {colIndex === 0 ? (
                  <div
                    className="flex items-center space-x-2"
                    style={{ paddingLeft: `${level * 20}px` }}
                  >
                    {(isLeafNode && row.tasks && row.tasks.length > 0) ||
                      (row.children && row.children.length > 0) ? (
                      <button
                        onClick={() => toggleRow(row.id)}
                        className="flex items-center"
                      >
                        {expandedRows[row.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    ) : null}
                    <span>{String(row[column.id as keyof TData] ?? "")}</span>
                  </div>
                ) : (
                  String(row[column.id as keyof TData] ?? "")
                )}
              </TableCell>
            ))}
            <TableCell className="text-right pr-4 w-[50px]">
              <div className="flex justify-end space-x-2">
                <Pencil
                  className="h-3 w-3 text-blue-900 cursor-pointer"
                  onClick={() => openEditModal(row)}
                />
                {/* <Trash className="h-3 w-3 text-[var(--red)] cursor-pointer" onClick={() => setDeletingCtrlId(row.id)} /> */}
              </div>
            </TableCell>
          </TableRow>

          {/* Independent Task Table - 5 columns */}
          {isLeafNode &&
            row.tasks &&
            row.tasks.length > 0 &&
            expandedRows[row.id] && (
              <TableRow
                key={`task-container-${row.id}`}
                className="bg-gray-100"
              >
                <TableCell colSpan={columns.length + 1} className="p-0">
                  <Table className="w-full">
                    <TableHeader className="bg-gray-200">
                      <TableRow className="h-6">
                        <TableHead className="text-[11px] h-6 p-1">
                          Task Title
                        </TableHead>
                        <TableHead className="text-[11px] h-6 p-1 max-w-[500px]">
                          Task Details
                        </TableHead>
                        <TableHead className="text-[11px] h-6 p-1">
                          Doer
                        </TableHead>
                        <TableHead className="text-[11px] h-6 p-1">
                          Review
                        </TableHead>
                        <TableHead className="text-[11px] h-6 p-1">
                          Frequency
                        </TableHead>
                        {role.toLowerCase().includes("admin") && (
                          <TableHead className="text-[11px] h-8 p-1 text-center">
                            Assignment
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {row.tasks.map((task) => (
                        <TableRow key={`task-${task.id}`}>
                          <TableCell className="text-[11px] ">
                            {task.task_title}
                          </TableCell>
                          <TableCell className="text-[11px] max-w-[500px]">
                            {task.task_details}
                          </TableCell>
                          <TableCell className="text-[11px]">
                            {task.doer}
                          </TableCell>
                          <TableCell className="text-[11px]">
                            {task.review}
                          </TableCell>
                          <TableCell className="text-[11px]">
                            {task.frequency}
                          </TableCell>
                          {role.toLowerCase().includes("admin") && (
                            <TableCell className="text-right  justify-center align-center px-1 flex ">
                              {/* <div className="flex justify-end space-x-2">
                            <Pencil className="h-3 w-3 text-blue-900 cursor-pointer" />
                            <Trash className="h-3 w-3 text-[var(--red)] cursor-pointer" />
                          </div> */}
                              <Link
                                href={{
                                  pathname:
                                    "/home/configuration/create-assignment",
                                  query: { task: JSON.stringify(task) },
                                }}
                                className="bg-[var(--blue)] w-5 h-5 px-0  flex items-center justify-center text-[10px] rounded-full"
                              >
                                +
                              </Link>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            )}

          {/* Child Rows */}
          {expandedRows[row.id] &&
            row.children &&
            row.children.length > 0 &&
            renderRows(row.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="w-full">
      {editingRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96  dark:bg-[#E5E5E5] dark:border dark:border-gray-600">
            <div className="flex justify-between items-center">
              <h6 className="text-[14px] font-semibold py-2 text-[var(--blue)]">
                Edit Item
              </h6>
              <Button
                onClick={() => setEditingRow(null)}
                className="bg-transparent hover:bg-transparent text-black"
              >
                <X size={18} />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block text-[11px] mb-2 dark:text-black">
                  Applicable
                </label>
                <select
                  className="w-full p-1 text-[11px] border rounded bg-[var(--table-bg-even)] dark:text-black"
                  value={applicableValue}
                  onChange={(e) => setApplicableValue(e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-[11px] mb-2 dark:text-black">
                  Justification
                </label>
                <input
                  type="text"
                  className="w-full text-[11px] p-1 border rounded bg-[var(--table-bg-even)]  dark:text-black"
                  value={justificationValue}
                  onChange={(e) => setJustificationValue(e.target.value)}
                  required={applicableValue === "Yes"}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-0.5 bg-[var(--red)] text-white text-[12px] rounded-[5px] dark:text-black "
                  onClick={() => setEditingRow(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-0.5 bg-[var(--blue)] text-white text-[12px] rounded-[5px] dark:text-black"
                  disabled={
                    applicableValue === "Yes" && !justificationValue.trim()
                  }
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteModal
        ctrlId={deletingCtrlId}
        isOpen={deletingCtrlId !== null}
        onClose={() => setDeletingCtrlId(null)}
        onDeleteSuccess={(deletedCtrlId: any) => {
          setFilteredData((prev) =>
            prev.filter((item) => item.id !== deletedCtrlId)
          );
          if (onDelete) {
            onDelete(deletedCtrlId);
          }
        }}
      />
      <div className="flex items-center justify-end py-2 space-x-1">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm px-3 h-7  text-[11px] bg-[#f9fafb] dark:bg-[#E5e5e5]"
        />
        {/* <Button
          onClick={handleExportCSV}
          className="bg-blue-500 text-white flex items-center"
        >
          <Download className="mr-2" /> Export
        </Button> */}
      </div>
      <div className="max-h-[70vh] overflow-auto relative">
        <Table className="w-full border-collapse">
          <TableHeader className="sticky top-0 z-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-white text-[12px] px-1 h-7 bg-[var(--purple)] shadow-md"
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
          <TableBody className="overflow-y-auto">
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-4 text-[11px] text-gray-500"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              renderRows(filteredData)
            )}
          </TableBody>
        </Table>
      </div>

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
