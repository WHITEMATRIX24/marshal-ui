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
import { Control } from "@/models/control";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";

const fetchControls = async (stdId: number, govId: string): Promise<Control[]> => {
  if (!stdId || !govId) throw new Error("stdId and govId are required");
  const token = Cookies.get("access_token");

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const urlEndpoint = `/controls/tree/with-tasks/?std_id=${stdId}&gov_id=${govId}`;
  const method = "GET";
  const response = await fetchL1ControlsByStandardApi({ urlEndpoint, method, headers });

  if (!response || !response.data?.items) {
    return [];
  }

  const transformData = (items: Control[]): Control[] => {
    return items.map(item => ({
      ...item,
      id: item.id,
      control_full_name: item.control_full_name,
      applicable_str: item.is_applicable === true ? "Yes" : "No",
      children: item.children ? transformData(item.children) : undefined,
    }));
  };

  console.log("Transformed Data:", transformData(response.data.items));
  return transformData(response.data.items);
};

export default function Page() {
  const stdId = useSelector((state: RootState) => state.Standerds.selected_std_id);
  const govIdCookie = Cookies.get("selected_governance");
  const [govId, setGovId] = useState<string | null>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [tableData, setTableData] = useState<Control[]>([]);

  useEffect(() => {
    setIsMounted(true);
    if (govIdCookie) {
      try {
        const parsedGovId = JSON.parse(govIdCookie);
        setGovId(parsedGovId.role_id);
      } catch (error) {
        console.error("Error parsing governance ID:", error);
      }
    }
  }, [govIdCookie]);

  const { data, error, isLoading } = useQuery<Control[], Error>({
    queryKey: ["controls", stdId, govId],
    queryFn: () => (stdId && govId ? fetchControls(stdId, govId) : Promise.resolve([])),
    enabled: !!stdId && !!govId,
  });
  function updateData(data: Control[], updatedRow: Control): Control[] {
    return data.map((row) =>
      row.id === updatedRow.id
        ? updatedRow
        : row.children
          ? { ...row, children: updateData(row.children, updatedRow) }
          : row
    );
  }
  useEffect(() => {
    if (error) {
      console.error("Error fetching controls:", error);
      router.push("/");
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
            console.log("Received updated row:", updatedRow);
            setTableData((prev) => updateData(prev, updatedRow));
          }}
        />
      </div>
    </div>
  );
}