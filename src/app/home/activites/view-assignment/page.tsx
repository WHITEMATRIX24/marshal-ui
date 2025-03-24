"use client";
import React from "react";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import { ViewAssignmentTable } from "@/components/activites/viewAssignment";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
type TableData = {
  complianceProviderId: string;
  standardName: string;
  activityName: string;
  doer: string;
  approver: string;
  startDate: string;
  endDate: string;
};
const columns: ColumnDef<TableData>[] = [
  {
    accessorKey: "complianceProviderId",
    header: "Compliance Provider ID",
  },
  {
    accessorKey: "standardName",
    header: "Standard Name",
  },
  {
    accessorKey: "activityName",
    header: "Activity Name",
  },
  {
    accessorKey: "doer",
    header: "Doer",
  },
  {
    accessorKey: "approver",
    header: "Approver",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "actions",
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

const dummyData: TableData[] = [
  {
    complianceProviderId: "CP-001",
    standardName: "ISO 9001",
    activityName: "Quality Audit",
    doer: "John Doe",
    approver: "Jane Smith",
    startDate: "2024-03-01",
    endDate: "2024-03-05",
  },
  {
    complianceProviderId: "CP-002",
    standardName: "ISO 14001",
    activityName: "Environmental Assessment",
    doer: "Alice Brown",
    approver: "Robert Johnson",
    startDate: "2024-04-10",
    endDate: "2024-04-15",
  },
  {
    complianceProviderId: "CP-003",
    standardName: "ISO 45001",
    activityName: "Safety Inspection",
    doer: "Michael Davis",
    approver: "Emily White",
    startDate: "2024-05-05",
    endDate: "2024-05-10",
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
        <ViewAssignmentTable columns={columns} data={dummyData} />
      </div>
    </div>
  );
}