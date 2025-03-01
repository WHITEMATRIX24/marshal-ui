"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { fetchL1ControlsByStandardApi } from "@/services/apis";
import { ApiResponse, Control } from "@/app/models/control";

// Interface for fetched data
// columns.tsx

// API function
// Modified fetchControls function to get ALL controls
const fetchControls = async (stdId: string): Promise<Control[]> => {
  if (!stdId) throw new Error("stdId is required");
  const token = Cookies.get("access_token");

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  console.log(stdId)
  // Remove level filter to get all controls
  const urlEndpoint = `/controls/?std_code_id=${stdId}`;
  const method = "GET";
  const response: ApiResponse<Control[]> | undefined = await fetchL1ControlsByStandardApi({ urlEndpoint, method, headers });

  return Array.isArray(response?.data) ? response.data : [];
};


// Breadcrumb Component
function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        {lastSegment && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {decodeURIComponent(lastSegment).replace(/-/g, " ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Function to update the DataTable data
function updateData(data: Control[], updatedRow: Control): Control[] {
  return data.map((row) =>
    row.ctrl_id === updatedRow.ctrl_id
      ? updatedRow
      : row.subRows
        ? { ...row, subRows: updateData(row.subRows, updatedRow) }
        : row
  );
}

// Main Page Component
export default function Page() {
  const [stdId, setStdId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setStdId(Cookies.get("std_id") || null);
  }, []);

  const [tableData, setTableData] = useState<Control[]>([]);

  const { data, error, isLoading } = useQuery<Control[], Error>({
    queryKey: ["controls", stdId],
    queryFn: () => (stdId ? fetchControls(stdId) : Promise.resolve([])),
    enabled: !!stdId,
  });

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]); // Runs when `data` updates

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const controlsMap = new Map<number, Control>();
      const hierarchicalData: Control[] = [];
      data.forEach((item) => {
        const control: Control = {
          ctrl_id: item.ctrl_id,
          ctrl_name: item.ctrl_name,
          applicable: item.applicable,
          justification: item.justification,
          parentCID: item.parentCID,
          std_code_id: item.std_code_id,
          ctrl_LVLID: item.ctrl_LVLID,
          is_active: item.is_active,
          subRows: [],
        };
        controlsMap.set(item.ctrl_id, control);
      });

      // Second pass - build hierarchy
      data.forEach((item) => {
        const control = controlsMap.get(item.ctrl_id);
        if (item.parentCID === 0) {
          hierarchicalData.push(control!);
        } else {
          const parent = controlsMap.get(item.parentCID);
          parent?.subRows?.push(control!);
        }
      });

      setTableData(hierarchicalData);
    } else {
      setTableData([]);
    }
  }, [data]);

  if (!isMounted) return null
  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col w-full mb-[50px]">
      <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <Breadcrumbs />
        </div>
      </header>
      <div className="py-0 w-full px-4">
        <DataTable<Control, unknown>
          columns={columns}
          data={Array.isArray(tableData) ? tableData : []}
          onEdit={(updatedRow) => {
            setTableData((prev) => updateData(prev, updatedRow));
          }}
        />

      </div>
    </div>
  );
}
