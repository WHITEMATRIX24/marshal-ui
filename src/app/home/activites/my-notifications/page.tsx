"use client";
import React from "react";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import { NotificationTable } from "@/components/activites/notification";
import { ColumnDef } from "@tanstack/react-table";

// Remove 'export' from the type since it's only used locally
type TableData = {
  notificationId: string;
  notificationDate: string;
  activityAssignment: string;
  status: string;
  notificationType: string;
};

// Remove 'export' from the columns array since it's used locally
const columns: ColumnDef<TableData>[] = [
  {
    accessorKey: "notificationId",
    header: "Notification ID",
  },
  {
    accessorKey: "notificationDate",
    header: "Notification Date",
  },
  {
    accessorKey: "activityAssignment",
    header: "Activity Assignment",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "notificationType",
    header: "Notification Type",
  },
];

const dummyData: TableData[] = [
  {
    notificationId: "N-001",
    notificationDate: "2024-03-01",
    activityAssignment: "Audit Scheduled",
    status: "Pending",
    notificationType: "Reminder",
  },
  {
    notificationId: "N-002",
    notificationDate: "2024-04-10",
    activityAssignment: "Inspection Completed",
    status: "Approved",
    notificationType: "Update",
  },
  {
    notificationId: "N-003",
    notificationDate: "2024-05-05",
    activityAssignment: "Compliance Review",
    status: "Rejected",
    notificationType: "Alert",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col w-full mb-[50px]">
      <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <BreadCrumbsProvider />
        </div>
      </header>
      <div className="py-0 w-full px-4">
        <NotificationTable columns={columns} data={dummyData} />
      </div>
    </div>
  );
}