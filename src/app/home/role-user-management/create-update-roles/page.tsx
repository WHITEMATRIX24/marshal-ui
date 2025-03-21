"use client";

import AddNewRoleModal from "@/components/add_newrole_form";
import { RolesManagementDataTable } from "@/components/rolesManagement/role_management_datatable";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import DeleteCnfModal from "@/components/ui/delete-cnf-modal";
import { showNewRoleAddForm } from "@/lib/global-redux/features/uiSlice";
import { RootState } from "@/lib/global-redux/store";
import { Pencil, Trash } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface RoleManagement {
  role_id: string;
  role_name: string;
}

const CreateUpdateRole = () => {
  const dispatch = useDispatch();
  const isModalVisible = useSelector(
    (state: RootState) => state.ui.addNewRoleOnRoleMenuModal.isVisible
  );
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  // delete modal close handler
  const handleDeletemodalClose = () => setDeleteModal(false);

  const columnData = [
    {
      accessorKey: "role_id",
      header: "Role Id",
      id: "role_id",
    },
    {
      accessorKey: "role_name",
      header: "Role Name",
      id: "role_name",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const handleEditOption = () => {
          dispatch(showNewRoleAddForm(row.original));
        };

        const handleDeleteOption = () => {
          setDeleteModal(true);
        };

        return (
          <div className="flex w-full justify-center gap-2 ">
            <Pencil
              onClick={handleEditOption}
              className="h-3 w-3 text-blue-900 cursor-pointer"
            />
            <Trash
              onClick={handleDeleteOption}
              className="h-3 w-3 text-[var(--red)] cursor-pointer"
            />
          </div>
        );
      },
    },
  ];
  const tableData = [
    {
      role_id: "test",
      role_name: "test",
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
      {isModalVisible && <AddNewRoleModal />}
      {deleteModal && (
        <DeleteCnfModal modalCloseHandler={handleDeletemodalClose} />
      )}
    </>
  );
};

export default CreateUpdateRole;
