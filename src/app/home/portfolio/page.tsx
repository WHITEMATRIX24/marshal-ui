"use client"
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { fetchL1ControlsByStandardApi } from "@/services/apis";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/global-redux/store";
import { Control } from "@/models/control";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";

const fetchControls = async (stdId: string): Promise<Control[]> => {
  if (!stdId) throw new Error("stdId is required");
  const token = Cookies.get("access_token");

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const urlEndpoint = `/controls/tree/with-tasks/?std_id=${stdId}&gov_id=1`;
  const method = "GET";
  const response = await fetchL1ControlsByStandardApi({ urlEndpoint, method, headers });

  if (!response || !response.data?.items) {
    return [];
  }

  // Transform the data to match the expected structure
  const transformData = (items: Control[]): Control[] => {
    return items.map(item => ({
      ...item,
      id: item.id,
      control_full_name: item.control_full_name,
      applicable_str: item.is_applicable === true ? "Yes" : "No", // Map 'id' to 'id'
      children: item.children ? transformData(item.children) : undefined, // Map 'children' to 'children'
    }));
  };
  console.log("Transformed Data:", transformData(response.data.items));

  return transformData(response.data.items);
};

// Function to update the DataTable data
function updateData(data: Control[], updatedRow: Control): Control[] {
  return data.map((row) =>
    row.id === updatedRow.id
      ? updatedRow
      : row.children
        ? { ...row, children: updateData(row.children, updatedRow) }
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
      console.log("Fetched Hierarchical Data:", data);
      setTableData(data);
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