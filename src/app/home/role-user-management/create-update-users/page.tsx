"use client";

import AddNewUserModal from "@/components/add_newuser_form";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import DeleteCnfModal from "@/components/ui/delete-cnf-modal";
import { UserManagementDataTable } from "@/components/userManagement/userManagement_dataTable";
import { showNewUserAddForm } from "@/lib/global-redux/features/uiSlice";
import { RootState } from "@/lib/global-redux/store";
import { Pencil, Trash } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface UserManagement {
  name: string;
  email_id: string;
  governance: string;
  role: string;
  status: string;
}

const CreateUpdateRole = () => {
  const dispatch = useDispatch();
  const isModalVisible = useSelector(
    (state: RootState) => state.ui.addNewUserOnRoleMenuModal.isVisible
  );
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  // delete modal close handler
  const handleDeletemodalClose = () => setDeleteModal(false);

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
    {
      id: "actions",
      header: "Actions",
      className: "w-10",
      cell: ({ row }: any) => {
        const handleEditOption = () => {
          dispatch(showNewUserAddForm(row.original));
        };

        const handleDeleteOption = () => {
          setDeleteModal(true);
        };

        return (
          <div className="w-full flex justify-center space-x-2">
            <Pencil
              onClick={handleEditOption}
              className="h-3 w-3 text-blue-900 cursor-pointer"
            />
            <Trash
              onClick={handleDeleteOption}
              className="h-3 w-3 text-[#C20114] cursor-pointer"
            />
          </div>
        );
      },
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
    {
      name: "test",
      email_id: "test",
      governance: "test",
      role: "test",
      status: "test",
    },
    {
      name: "test",
      email_id: "test",
      governance: "test",
      role: "test",
      status: "test",
    },
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
          <UserManagementDataTable columns={columnData} data={tableData} />
        </div>
      </div>
      {isModalVisible && <AddNewUserModal />}
      {deleteModal && (
        <DeleteCnfModal modalCloseHandler={handleDeletemodalClose} />
      )}
    </>
  );
};

export default CreateUpdateRole;
