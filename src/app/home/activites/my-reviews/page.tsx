import { ActivityReviewTable } from "@/components/activites/reviewsTable";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import React from "react";

const MyReviews = () => {
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
      accessorKey: "task_start_date",
      header: "Task Start Date",
      id: "task_start_date",
    },
    {
      accessorKey: "task_end_date",
      header: "Task End Date",
      id: "task_end_date",
    },
    {
      accessorKey: "planned_start_date",
      header: "Planned Start Date",
      id: "planned_start_date",
    },
    {
      accessorKey: "planned_end_date",
      header: "Planned End Date",
      id: "planned_end_date",
    },
  ];
  const tableData = [
    {
      task_title: "test",
      task_details: "test",
      task_start_date: "test",
      task_end_date: "test",
      planned_start_date: "test",
      planned_end_date: "test",
    },
  ];

  return (
    <div className="flex flex-col w-full mb-[50px]">
      <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <BreadCrumbsProvider />
        </div>
      </header>
      <div className="py-0 w-full px-4">
        <ActivityReviewTable columns={columnData} data={tableData} />
      </div>
    </div>
  );
};

export default MyReviews;
