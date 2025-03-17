"use client";

import AddNewUserModal from "@/components/add_newuser_form";
import { RolesManagementDataTable } from "@/components/rolesManagement/role_management_datatable";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import { RootState } from "@/lib/global-redux/store";
import React from "react";
import { useSelector } from "react-redux";

const CreateUpdateRole = () => {
  const isModalVisible = useSelector(
    (state: RootState) => state.ui.addNewUserOnRoleMenuModal
  );
  const columnData = [
    {
      accessorKey: "name",
      header: "Name",
      id: "name",
    },
    {
      accessorKey: "email_id",
      header: "Email Id",
      id: "email_id",
    },
    {
      accessorKey: "governance",
      header: "Governance",
      id: "governance",
    },
    {
      accessorKey: "role",
      header: "Role",
      id: "role",
    },
    {
      accessorKey: "status",
      header: "Status",
      id: "status",
    },
  ];
  const tableData = [
    {
      name: "test",
      email_id: "test",
      governance: "test",
      role: "test",
      status: "test",
    },
  ];

  return (
    <>
      <div className="flex flex-col w-full mb-[50px]">
        <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <BreadCrumbsProvider />
          </div>
        </header>
        <div className="py-0 w-full px-4">
          <RolesManagementDataTable columns={columnData} data={tableData} />
        </div>
      </div>
      {isModalVisible && <AddNewUserModal />}
    </>
  );
};

export default CreateUpdateRole;
