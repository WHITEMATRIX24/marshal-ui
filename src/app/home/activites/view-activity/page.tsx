"use client";
import { ViewActivityTable } from "@/components/activites/viewactivitytable";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import { fetchActivitesControlsApi } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import React from "react";
import Cookies from "js-cookie";
import { formatDate } from "@/utils/formater";

const ViewActivity = () => {
  const token = Cookies.get("access_token");
  const columnData = [
    {
      accessorKey: "task_name",
      header: "Task Name",
      id: "task_name",
    },
    {
      accessorKey: "task_details",
      header: "Task Details",
      id: "task_details",
    },
    {
      accessorKey: "doer",
      header: "Doer",
      id: "doer",
    },
    {
      accessorKey: "reviewer",
      header: "Reviewer",
      id: "reviewer",
    },
    {
      accessorKey: "approver",
      header: "Approver",
      id: "approver",
    },
    {
      accessorKey: "plan_startdate",
      header: "Planned Start Date",
      id: "plan_startdate",
      cell: ({ row }: any) => formatDate(row.original.plan_startdate),
    },
    {
      accessorKey: "actual_startdate",
      header: "Actual Start Date",
      id: "actual_startdate",
      cell: ({ row }: any) => formatDate(row.original.actual_startdate),
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      id: "end_date",
      cell: ({ row }: any) => formatDate(row.original.end_date),
    },
    {
      accessorKey: "status",
      header: "Status",
      id: "status",
    },
    {
      accessorKey: "action",
      header: "Action",
      id: "action",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        return (
          <div className="flex w-full justify-center gap-2">
            <Pencil className="h-3 w-3 text-blue-900 cursor-pointer" />
            <Trash className="h-3 w-3 text-[var(--red)] cursor-pointer" />
          </div>
        );
      },
    },
  ];

  const tableData = [
    {
      activity_title: "test",
      activity_description: "test",
      doer_role: "test",
      frequency: "test",
      duration: "test",
      approve_role: "test",
      status: "test",
    },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ["activites"],
    queryFn: async () =>
      await fetchActivitesControlsApi({
        method: "GET",
        urlEndpoint: "/taskdetail/details",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  return (
    <div className="flex flex-col w-full mb-[50px]">
      <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <BreadCrumbsProvider />
        </div>
      </header>
      <div className="py-0 w-full px-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : !isLoading && error ? (
          <p>Something went wrong ...</p>
        ) : (
          !isLoading &&
          data && (
            <ViewActivityTable columns={columnData} data={data.data.items} />
          )
        )}
      </div>
    </div>
  );
};

export default ViewActivity;
