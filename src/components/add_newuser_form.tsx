import { hideNewUserAddForm } from "@/lib/global-redux/features/uiSlice";
import { RootState } from "@/lib/global-redux/store";
import {
  createUserApi,
  createUserWithFileApi,
  fetchAllGovernanceDataApi,
  fetchAllRolesDataApi,
  updateUserApi,
} from "@/services/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { governance } from "@/models/governance";
import { roleModel } from "@/models/roles";
import { CreateUserModel } from "@/models/users";
import { toast } from "sonner";

const AddNewUserModal = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("access_token");
  const selectedGovernance = JSON.parse(
    Cookies.get("selected_governance") || "null"
  );
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
        return toast.success("sucessfully created user");
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
      return toast.success("sucessfully created user");
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
          <select
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
          </select>
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
            <div className="flex flex-col gap-1 pl-1 mt-2">
              <label className="text-[12px]">Add csv file</label>
              <input
                type="file"
                accept=".xls, .xlsx"
                className="text-[12px] w-fit"
                onChange={(e) => {
                  if (e.target.files) {
                    if (e.target.files.length > 0)
                      setUserExcellFile(e.target.files[0]);
                    else setUserExcellFile(null);
                  }
                }}
              />
            </div>
          )}
          <div className="flex gap-4 mt-3 justify-end">
            <button
              className="px-4 py-0.5 bg-[var(--red)] text-white text-[12px] rounded-[5px] dark:text-black "
              type="reset"
            >
              Cancel
            </button>

            <button
              className="px-4 py-0.5 bg-[var(--blue)] text-white text-[12px] rounded-[5px] dark:text-black"
              type="submit"
              disabled={
                userExcellFile ? createUserWithFilePending : createUserPending
              }
            >
              {userExcellFile
                ? createUserWithFilePending
                  ? "please wait"
                  : "Submit"
                : createUserPending
                ? "please wait"
                : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUserModal;
