"use client";

import { RolesManagementDataTable } from "@/components/rolesManagement/role_management_datatable";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import { showEditRoleForm } from "@/lib/global-redux/features/uiSlice";
import { RootState } from "@/lib/global-redux/store";
import { Pencil, Trash } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { fetchClientRolesApi } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";
import EditNewRoleModal from "@/components/rolesManagement/edit_role_form";
import DeleteRoleModal from "@/components/rolesManagement/deleteRoleModal";
import Loader from "@/components/loader";

export interface Role {
  role_name: string;
  role_sort_name: string;
  role_type_id: number;
  id: number;
  is_active: boolean;
}

const CreateUpdateRole = () => {
  const dispatch = useDispatch();
  const isModalVisible = useSelector(
    (state: RootState) => state.ui.editRoleOnRoleMenuModal.isVisible
  );
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);
  const token = Cookies.get("access_token");

  const { data, isLoading, error } = useQuery({
    queryKey: ["clientroles"],
    queryFn: async () =>
      await fetchClientRolesApi({
        method: "GET",
        urlEndpoint: "/clientrole/client-roles",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  console.log("API Response Role Table:", data?.data?.items);
  const activeRoles =
    data?.data?.items?.filter((role: Role) => role.is_active) || [];

  const columnData = [
    {
      accessorKey: "role_sort_name",
      header: "Role Short Name",
      id: "role_sort_name",
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
          dispatch(showEditRoleForm(row.original));
        };

        const handleDeleteOption = () => {
          setDeletingRoleId(row.original.id);
          setDeleteModal(true);
        };

        return (
          <div className="flex w-full justify-center gap-2">
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
            <Loader />
          ) : error ? (
            <p>Something went wrong ...</p>
          ) : (
            data && (
              <RolesManagementDataTable
                columns={columnData}
                data={activeRoles}
              />
            )
          )}
        </div>
      </div>
      {isModalVisible && <EditNewRoleModal />}
      {deleteModal && (
        <DeleteRoleModal
          role_id={deletingRoleId}
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onDeleteSuccess={(deletedRoleId) => {
            if (deletedRoleId) {
              setDeletingRoleId(null);
              setDeleteModal(false);
            }
          }}
        />
      )}
    </>
  );
};

export default CreateUpdateRole;
