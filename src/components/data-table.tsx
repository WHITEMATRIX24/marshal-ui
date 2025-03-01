"use client";
import * as React from "react";
import {
  Pencil,
  Trash,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onEdit?: (updatedRow: TData) => void;
  onRowExpand?: (row: TData) => void;
}

export function DataTable<
  TData extends { ctrl_id: number; subRows?: TData[] },
  TValue
>({ columns, data, onEdit }: DataTableProps<TData, TValue>) {
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [expandedRows, setExpandedRows] = React.useState<
    Record<string, boolean>
  >({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data);
  const [editingRow, setEditingRow] = React.useState<TData | null>(null);
  const [applicableValue, setApplicableValue] = React.useState("");
  const [justificationValue, setJustificationValue] = React.useState("");

  //search
  React.useEffect(() => {
    const filterNestedData = (rows: TData[]): TData[] => {
      return rows
        .map(row => ({ ...row, subRows: row.subRows ? filterNestedData(row.subRows) : [] }))
        .filter(row => {
          const rowMatches = Object.values(row).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          );
          const subRowsMatch = row.subRows?.length > 0;

          return rowMatches || subRowsMatch;
        });
    };

    setFilteredData(filterNestedData(data));
  }, [searchQuery, data]);

  const flattenDataForExport = (data: TData[]): any[] => {
    const flatten = (items: TData[]): any[] => {
      return items.flatMap(item => {
        const { subRows, ...rest } = item as any;
        const flattenedItem = { ...rest };
        const subItems = subRows ? flatten(subRows) : [];
        return [flattenedItem, ...subItems];
      });
    };

    return flatten(data);
  };

  const handleExportCSV = () => {
    const exportData = flattenDataForExport(filteredData);
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "exported_data.csv");
  };
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
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2 justify-end">
            <Pencil
              className="h-4 w-4 text-black cursor-pointer"
              onClick={() => {
                setEditingRow(row.original);
                setApplicableValue((row.original as any).applicable);
                setJustificationValue((row.original as any).justification);
              }}
            />
            <Trash className="h-4 w-4 text-black cursor-pointer" />
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRow && onEdit) {
      const updatedRow = {
        ...editingRow,
        applicable: applicableValue,
        justification: justificationValue,
      };
      onEdit(updatedRow);
      setEditingRow(null);
    }
  };
  const openEditModal = (row: TData) => {
    setEditingRow(row);
    setApplicableValue((row as any).applicable || "");
    setJustificationValue((row as any).justification || "");
  };

  const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);


  const renderRows = (rows: TData[], level: number = 0) => {

    return table.getRowModel().rows.map((tableRow) => {
      const row = tableRow.original;
      return (
        <React.Fragment key={row.ctrl_id}>
          <TableRow className={`transition-colors ${expandedRows[row.ctrl_id] ? "bg-gray-100" : ""}`}>
            {columns.map((column, colIndex) => (
              <TableCell key={column.id}>
                {colIndex === 0 ? (
                  <div className="flex items-center space-x-2" style={{ paddingLeft: `${level * 20}px` }}>
                    {row.subRows && row.subRows.length > 0 && (
                      <button onClick={() => toggleRow(row.ctrl_id)} className="flex items-center">
                        {expandedRows[row.ctrl_id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    )}
                    <span>{String(row[column.id as keyof TData] ?? "")}</span>
                  </div>
                ) : (
                  String(row[column.id as keyof TData] ?? "")
                )}
              </TableCell>
            ))}
            <TableCell>
              <div className="flex space-x-2">
                <Pencil
                  className="h-4 w-4 text-black cursor-pointer"
                  onClick={() => openEditModal(row)}
                />
                <Trash
                  className="h-4 w-4 text-orange-500 cursor-pointer"
                  onClick={() => openEditModal(row)}
                />

              </div>
            </TableCell>
          </TableRow>

          {expandedRows[row.ctrl_id] &&
            row.subRows &&
            row.subRows.length > 0 &&
            renderRows(row.subRows, level + 1)}
        </React.Fragment>
      );
    });
  };


  return (
    <div className="w-full">
      {editingRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Row</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Applicable
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={applicableValue}
                  onChange={(e) => setApplicableValue(e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Justification
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={justificationValue}
                  onChange={(e) => setJustificationValue(e.target.value)}
                  required={applicableValue === "Yes"}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-500"
                  onClick={() => setEditingRow(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
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
      <div className="flex items-center justify-end py-4 space-x-5">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />

        {/* <Button variant="outline" className="bg-blue-500 text-white flex items-center">
                    <ChartColumnBig className="mr-2" /> Customize Cols
                </Button> */}
        <Button
          onClick={handleExportCSV}
          className="bg-blue-500 text-white flex items-center"
        >
          <Download className="mr-2" /> Export
        </Button>
      </div>

      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="bg-black text-white">
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
          {renderRows(filteredData)}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between py-4">
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
  );
}
