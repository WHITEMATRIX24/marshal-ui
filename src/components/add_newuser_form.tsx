import { hideNewUserAddForm } from "@/lib/global-redux/features/uiSlice";
import { RootState } from "@/lib/global-redux/store";
import {
  createUserApi,
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
  const userEditData = useSelector(
    (state: RootState) => state.ui.addNewUserOnRoleMenuModal.data
  );

  const [formData, setFormData] = useState<CreateUserModel>(
    userEditData
      ? userEditData
      : {
          username: "",
          email_address: "",
          gov_id: null,
          phone_number: "",
          link_to_role_id: null,
          password: "",
        }
  );
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

  // create handler

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
        <form className="flex flex-col gap-2" onSubmit={handleCreate}>
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
                <option value={gov.id} key={gov.id}>
                  {gov.gov_name}
                </option>
              ))
            )}
          </select>
          <select
            value={JSON.stringify(formData.link_to_role_id)}
            onChange={(e) =>
              setFormData({
                ...formData,
                link_to_role_id: JSON.parse(e.target.value),
              })
            }
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
          >
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
          {/* <div className="flex items-center gap-7">
            <p className="text-[11px] dark:text-black">Status</p>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value="true"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: JSON.parse(e.target.value),
                  })
                }
                name="newUserFormStatus"
                id="newUserActiveStatus"
                className="text-[13px] dark:bg-white dark:border-white dark:checked:bg-white dark:checked:border-white"
              />

              <label
                htmlFor="newUserActiveStatus"
                className="text-[11px] dark:text-black"
              >
                Active
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value="false"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: JSON.parse(e.target.value),
                  })
                }
                name="newUserFormStatus"
                id="newUserInactiveStatus"
                className="text-[13px]"
              />
              <label
                htmlFor="newUserInactiveStatus"
                className="text-[11px] dark:text-black"
              >
                Inactive
              </label>
            </div>
          </div> */}
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
              disabled={createUserPending}
            >
              {createUserPending ? "please wait" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUserModal;
