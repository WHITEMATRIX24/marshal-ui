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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUserApi, fetchUsersDataApi } from "@/services/apis";
import { toast } from "sonner";
import useGovAndRoles from "@/utils/gov_and_roles";

const CreateUpdateUser = () => {
  useGovAndRoles();
  const dispatch = useDispatch();
  const isModalVisible = useSelector(
    (state: RootState) => state.ui.addNewUserOnRoleMenuModal.isVisible
  );

  const token = Cookies.get("access_token");
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const queryClient = useQueryClient();
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
      handleDeletemodalClose();
      queryClient.invalidateQueries({ queryKey: ["usersdata"] });
      toast.success("User deleted successfully!", {
        style: { backgroundColor: "#28a745", color: "white", border: "none" },
      });
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
          ) : error ? (
            <p>Something went wrong ...</p>
          ) : (
            data && (
              <UserManagementDataTable
                columns={columnData}
                data={data.data.items.filter((user: any) => user.is_active === true)}
              />
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

export default CreateUpdateUser;
