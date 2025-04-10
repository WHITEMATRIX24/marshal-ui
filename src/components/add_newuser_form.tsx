import { hideNewUserAddForm } from "@/lib/global-redux/features/uiSlice";
import { RootState } from "@/lib/global-redux/store";
import {
  createUserApi,
  createUserWithFileApi,
  downloadUserExcelTemplateApi,
  fetchAllGovernanceDataApi,
  fetchAllRolesDataApi,
  updateUserApi,
} from "@/services/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { governance } from "@/models/governance";
import { roleModel } from "@/models/roles";
import { CreateUserModel } from "@/models/users";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import { saveAs } from "file-saver";
const AddNewUserModal = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("access_token");
  const selectedGovernance = JSON.parse(
    Cookies.get("selected_governance") || "null"
  );
  const queryClient = useQueryClient();
  const userEditData = useSelector(
    (state: RootState) => state.ui.addNewUserOnRoleMenuModal.data
  );

  const [formData, setFormData] = useState<CreateUserModel>(
    userEditData
      ? {
        username: userEditData.username,
        email_address: userEditData.email_address,
        gov_id: userEditData.gov_id,
        phone_number: userEditData.phone_number,
        link_to_role_id: userEditData.link_to_role_id,
        is_active: userEditData.is_active,
      }
      : {
        username: "",
        email_address: "",
        gov_id: selectedGovernance.governance_id || null,
        phone_number: "",
        link_to_role_id: null,
        password: "",
        is_active: true,
      }
  );
  const [userExcellFile, setUserExcellFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const handleModalClose = () => dispatch(hideNewUserAddForm());

  // initial governance data
  const {
    data: governaceData,
    isLoading: governanceLoading,
    isError: governanceError,
  } = useQuery({
    queryKey: ["allgovernances"],
    queryFn: async () =>
      await fetchAllGovernanceDataApi({
        method: "GET",
        urlEndpoint: "/governance",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  // initial roles data
  const {
    data: rolesData,
    isLoading: rolesLoading,
    isError: rolesError,
  } = useQuery({
    queryKey: ["allroles"],
    queryFn: async () =>
      await fetchAllRolesDataApi({
        method: "GET",
        urlEndpoint: "/role/roles",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  //////// create handler with no file
  const { mutateAsync: createUser, isPending: createUserPending } = useMutation(
    {
      mutationFn: userEditData ? updateUserApi : createUserApi,
      onError: (error) => {
        return toast.error(error.message || "something went wrong", {
          style: { backgroundColor: "#ff5555", color: "white", border: "none" },
        });
      },
      onSuccess: () => {
        dispatch(hideNewUserAddForm());
        queryClient.invalidateQueries({ queryKey: ["usersdata"] });
        toast.success("User added successfully!", {
          style: { backgroundColor: "#28a745", color: "white", border: "none" },
        });
      },
    }
  );
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      email_address,
      gov_id,
      link_to_role_id,
      password,
      phone_number,
      username,
    } = formData;
    if (
      !username ||
      !email_address ||
      !gov_id ||
      !link_to_role_id ||
      !phone_number ||
      (!userEditData && !password)
    ) {
      return toast.warning("fill the form");
    }

    createUser({
      method: userEditData ? "PUT" : "POST",
      urlEndpoint: userEditData ? `/users/${userEditData.id}` : "/users",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    });
  };

  /////////create handler with file
  const {
    mutateAsync: createUserWithFile,
    isPending: createUserWithFilePending,
  } = useMutation({
    mutationFn: createUserWithFileApi,
    onError: (error) => {
      return toast.error(error.message || "something went wrong", {
        style: { backgroundColor: "#ff5555", color: "white", border: "none" },
      });
    },
    onSuccess: () => {
      dispatch(hideNewUserAddForm());
      queryClient.invalidateQueries({ queryKey: ["usersdata"] });
      toast.success("User added successfully!", {
        style: { backgroundColor: "#28a745", color: "white", border: "none" },
      });
    },
  });
  const handleCreateWithFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userExcellFile) return toast.warning("add file");

    const formData = new FormData();
    formData.append("file", userExcellFile);

    createUserWithFile({
      method: "POST",
      urlEndpoint: `/users/import/excel`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
  };
  const exportMutation = useMutation<AxiosResponse, Error, void>({
    mutationFn: () =>
      downloadUserExcelTemplateApi({
        method: "GET",
        urlEndpoint: "/users/import/excel/template", // Update endpoint if different
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }),
    onSuccess: (response) => {
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "users_template.xlsx");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setUserExcellFile(file);
    }
  };
  return (
    <div className="fixed top-0 -left-0 h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto z-10">
      <div className="flex flex-col gap-2 w-full md:w-[25rem] h-auto bg-white dark:bg-[#E5E5E5] px-5 py-4 rounded-md dark:border dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h6 className="text-[14px] font-semibold text-[var(--blue)]">
            {userEditData ? "Edit User" : "Add New User"}
          </h6>
          <button onClick={handleModalClose} className="dark:text-black">
            X
          </button>
        </div>
        <form
          className="flex flex-col gap-2"
          onSubmit={userExcellFile ? handleCreateWithFile : handleCreate}
        >
          <input
            type="text"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="Name"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <input
            type="text"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="Email Id"
            value={formData.email_address}
            onChange={(e) =>
              setFormData({ ...formData, email_address: e.target.value })
            }
          />
          <input
            type="text"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="phone No"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />
          {!userEditData && (
            <input
              type="text"
              className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
              placeholder="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          )}
          {/* governance select */}
          {/* <select
            value={JSON.stringify(formData.gov_id)}
            onChange={(e) =>
              setFormData({ ...formData, gov_id: JSON.parse(e.target.value) })
            }
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
          >
            {governanceLoading ? (
              <option disabled>loading...</option>
            ) : !governanceLoading && governanceError ? (
              <option disabled>something went wrong</option>
            ) : (
              !governanceLoading &&
              governaceData?.data.items.map((gov: governance) => (
                <option
                  disabled={gov.id != selectedGovernance.governance_id}
                  value={gov.id}
                  key={gov.id}
                >
                  {gov.gov_name}
                </option>
              ))
            )}
          </select> */}
          <select
            value={
              formData.link_to_role_id === null
                ? "default"
                : JSON.stringify(formData.link_to_role_id)
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                link_to_role_id: JSON.parse(e.target.value),
              })
            }
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
          >
            <option value="default" disabled>
              Select role
            </option>
            {rolesLoading ? (
              <option disabled>loading...</option>
            ) : !rolesLoading && rolesError ? (
              <option disabled>something went wrong</option>
            ) : (
              !rolesLoading &&
              rolesData?.data.items.map((role: roleModel) => (
                <option value={role.id} key={role.id}>
                  {role.role_name}
                </option>
              ))
            )}
          </select>
          {/* excell file */}
          {!userEditData && (
            <>
              <div className="relative my-0">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-[#E5E5E5] text-[10px] text-gray-500 dark:text-gray-400">
                    OR
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="file"
                    id="excel-upload-user"
                    hidden
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('excel-upload-user')?.click()}
                    className="py-1 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap"
                    disabled={createUserPending || createUserWithFilePending}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 24"
                      fill="currentColor"
                    >
                      <path d="M13 11h-2v3H8v2h3v3h2v-3h3v-2h-3zm1-9H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                    </svg>
                    Import from Excel
                  </button>
                  {selectedFileName && (
                    <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {selectedFileName}
                    </span>
                  )}
                </div>

                <button
                  className="cursor-pointer bg-transparent text-[var(--blue)] text-[10px] px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 group justify-self-end"
                  onClick={(e) => {
                    e.preventDefault();
                    exportMutation.mutate();
                  }}
                  disabled={exportMutation.isPending}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 group-hover:translate-y-0.5 transition-transform text-[var(--blue)]"
                    viewBox="0 0 20 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {exportMutation.isPending ? "Downloading..." : "Template"}
                </button>
              </div>
            </>
          )}

          <div className="flex gap-4 mt-3 justify-end">
            <button
              className="px-4 py-0.5 bg-[var(--red)] text-white text-[12px] rounded-[5px] dark:text-black"
              type="button"
              onClick={handleModalClose}
              disabled={createUserPending || createUserWithFilePending}
            >
              Cancel
            </button>
            <button
              className="px-4 py-0.5 bg-[var(--blue)] text-white text-[12px] rounded-[5px] dark:text-black"
              type="submit"
              disabled={createUserPending || createUserWithFilePending}
            >
              {createUserPending || createUserWithFilePending
                ? "Submitting..."
                : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUserModal;