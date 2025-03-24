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
import Cookies from "js-cookie";
import { fetchRolesApi } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";
export interface Role {
  role_name: string;
  id: number;
  is_active: boolean;
}
const CreateUpdateRole = () => {
  const dispatch = useDispatch();
  const isModalVisible = useSelector(
    (state: RootState) => state.ui.addNewRoleOnRoleMenuModal.isVisible
  );
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const token = Cookies.get("access_token");
  // delete modal close handler
  const handleDeletemodalClose = () => setDeleteModal(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["usersdata"],
    queryFn: async () =>
      await fetchRolesApi({
        method: "GET",
        urlEndpoint: "/role/roles",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
  console.log("API Response Role Table:", data?.data?.items);

  const columnData = [
    {
      accessorKey: "id",
      header: "Role Id",
      id: "id",
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

  return (
    <>
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
              <RolesManagementDataTable columns={columnData} data={data?.data?.items} />
            )
          )}
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
