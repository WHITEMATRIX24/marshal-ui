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
import Cookies from "js-cookie";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteUserApi, fetchUsersDataApi } from "@/services/apis";
import { toast } from "sonner";
import govAndRoles from "@/utils/gov_and_roles";

const CreateUpdateRole = () => {
  const dispatch = useDispatch();
  const isModalVisible = useSelector(
    (state: RootState) => state.ui.addNewUserOnRoleMenuModal.isVisible
  );
  const token = Cookies.get("access_token");
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["usersdata"],
    queryFn: async () =>
      await fetchUsersDataApi({
        method: "GET",
        urlEndpoint: "/users",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  // roles and governacne to redux
  govAndRoles();

  const columnData = [
    {
      accessorKey: "username",
      header: "Name",
      id: "username",
    },
    {
      accessorKey: "email_address",
      header: "Email Id",
      id: "email_address",
    },
    {
      accessorKey: "gov_id",
      header: "Governance",
      id: "gov_id",
    },
    {
      accessorKey: "link_to_role_id",
      header: "Role",
      id: "link_to_role_id",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      id: "is_active",
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
          setDeleteUserId(row.original.id);
        };

        return (
          <div className="w-full flex justify-center space-x-2">
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

  /////////////// delete modal handlers
  const handleDeletemodalClose = () => setDeleteModal(false);

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      toast.success("user successfully deleted");
      handleDeletemodalClose();
      return;
    },
    onError: (error) => {
      return toast.error("something went wrong");
    },
  });

  const deleteHandler = async () => {
    if (!deleteUserId) return;
    deleteUser({
      method: "DELETE",
      urlEndpoint: `/users/${deleteUserId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

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
              <UserManagementDataTable columns={columnData} data={data?.data} />
            )
          )}
        </div>
      </div>
      {isModalVisible && <AddNewUserModal />}
      {deleteModal && (
        <DeleteCnfModal
          modalCloseHandler={handleDeletemodalClose}
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default CreateUpdateRole;
