"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { fetchL1ControlsByStandardApi } from "@/services/apis";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/global-redux/store";
import { ApiResponse, Control } from "@/models/control";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";

const fetchControls = async (stdId: string): Promise<Control[]> => {
  if (!stdId) throw new Error("stdId is required");
  const token = Cookies.get("access_token");

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  console.log(stdId);
  const urlEndpoint = `/controls/?std_code_id=${stdId}`;
  const method = "GET";
  const response: ApiResponse<Control[]> | undefined =
    await fetchL1ControlsByStandardApi({ urlEndpoint, method, headers });

  return Array.isArray(response?.data) ? response.data : [];
};

// Breadcrumb Component

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
  const stdId = useSelector(
    (state: RootState) => state.Standerds.selected_std_id
  );

  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [tableData, setTableData] = useState<Control[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, error, isLoading } = useQuery<Control[], Error>({
    queryKey: ["controls", stdId],
    queryFn: () =>
      stdId ? fetchControls(JSON.stringify(stdId)) : Promise.resolve([]),
    enabled: !!stdId,
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching controls:", error);
      router.push("/"); // Redirect to home if an error occurs
    }
  }, [error, router]);

  useEffect(() => {
    if (data) {
      console.log("Fetched Data:", data);
      setTableData(data);
    }
  }, [data]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const controlsMap = new Map<number, Control>();
      const hierarchicalData: Control[] = [];

      data.forEach((item) => {
        const control: Control = {
          ctrl_id: item.ctrl_id,
          ctrl_name: item.ctrl_name,
          applicable: item.applicable,
          applicable_str: item.applicable === true ? "Yes" : "No",
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

  if (!isMounted) return null;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col w-full mb-[50px]">
      <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <BreadCrumbsProvider />
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
