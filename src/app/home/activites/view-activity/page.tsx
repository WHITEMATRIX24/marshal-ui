"use client";
import { ViewActivityTable } from "@/components/activites/viewactivitytable";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import { fetchActivitesControlsApi } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import React from "react";
import Cookies from "js-cookie";

const ViewActivity = () => {
  const token = Cookies.get("access_token");
  const columnData = [
    {
      accessorKey: "task_title",
      header: "Task Title",
      id: "task_title",
    },
    {
      accessorKey: "task_details",
      header: "Task Details",
      id: "task_details",
    },
    {
      accessorKey: "doer_role",
      header: "Doer Role",
      id: "doer_role",
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
      id: "frequency",
    },
    {
      accessorKey: "duration",
      header: "Duration",
      id: "duration",
    },
    {
      accessorKey: "approve_role",
      header: "Approve Role",
      id: "approve_role",
    },
    {
      accessorKey: "status",
      header: "Status",
      id: "status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        // const handleEditOption = () => {
        //   dispatch(showNewRoleAddForm(row.original));
        // };

        // const handleDeleteOption = () => {
        //   setDeleteModal(true);
        // };

        return (
          <div className="flex w-full justify-center gap-2 ">
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
        urlEndpoint: "/tasks",
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
