"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
import { Payment, columns } from "@/components/columns";
import { fetchL1ControlsByStandardApi } from "@/services/apis";

// Interface for fetched data
// columns.tsx
// export interface PaymentInterface {
//     id: string;
//     appRevAreaName: string;
//     revAreaDetails: string;
//     applicable: string;
//     justification: string;
//     subRows?: Payment[]; // Ensure subRows are part of the type
// }
// API function
// page.tsx

// Modified fetchControls function to get ALL controls
// const fetchControls = async (stdId: string): Promise<ControlData[]> => {
//     if (!stdId) throw new Error("stdId is required");
//     const token = Cookies.get("access_token");
//     console.log(token);
//     const headers = {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//     };

//     // Remove level filter to get all controls
//     const urlEndpoint = `/controls/?std_code_id=${stdId}`;
//     const response = await fetchL1ControlsByStandardApi({ urlEndpoint, headers });

//     return Array.isArray(response.data) ? response.data : [];
// };

// Modified useEffect for data transformation

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
function updateData(data: Payment[], updatedRow: Payment): Payment[] {
  return data.map((row) =>
    row.id === updatedRow.id
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
  }, []); // Fetch stdId from cookies

  const [tableData, setTableData] = useState<Payment[]>([]);

  // const { data, error, isLoading } = useQuery({
  //     queryKey: ["controls", stdId],
  //     queryFn: () => (stdId ? fetchControls(stdId) : Promise.resolve([])),
  //     enabled: !!stdId, // Ensures it only runs when stdId is available
  //     onSuccess: (fetchedData) => setTableData(fetchedData),
  //     // Store data in state
  // });
  // useEffect(() => {
  //     if (data && Array.isArray(data)) {
  //         // Create a map and array for hierarchical structure
  //         const controlsMap = new Map<number, Payment>();
  //         const hierarchicalData: Payment[] = [];

  //         // First pass - create all entries
  //         data.forEach((item) => {
  //             const control: Payment = {
  //                 id: item.ctrl_id.toString(),
  //                 appRevAreaName: item.ctrl_name,
  //                 revAreaDetails: item.revAreaDetails || "N/A",
  //                 applicable: item.applicable ? "Yes" : "No",
  //                 justification: item.justification,
  //                 subRows: [],
  //             };
  //             controlsMap.set(item.ctrl_id, control);
  //         });

  //         // Second pass - build hierarchy
  //         data.forEach((item) => {
  //             const control = controlsMap.get(item.ctrl_id);
  //             if (item.parentCID === 0) {
  //                 hierarchicalData.push(control!);
  //             } else {
  //                 const parent = controlsMap.get(item.parentCID);
  //                 parent?.subRows?.push(control!);
  //             }
  //         });

  //         setTableData(hierarchicalData);
  //     } else {
  //         setTableData([]);
  //     }
  // }, [data]);

  // if (!isMounted) return null
  // if (isLoading) return <p>Loading...</p>;
  // if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col w-full">
      <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <Breadcrumbs />
        </div>
      </header>
      <div className="py-0 w-full px-4">
        {/* <DataTable
          columns={columns}
          data={Array.isArray(tableData) ? tableData : []}
          onEdit={(updatedRow) => {
            setTableData((prev) => updateData(prev, updatedRow as Payment));
          }}
        /> */}
      </div>
    </div>
  );
}
