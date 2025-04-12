import { Role } from "@/app/home/role-user-management/create-or-update-roles/page";
import { hideEditRoleForm } from "@/lib/global-redux/features/uiSlice";
import { RootState } from "@/lib/global-redux/store";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { EditRolesApi, fetchAllRolesDataApi } from "@/services/apis";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";

const EditNewRoleModal = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const token = Cookies.get("access_token");
  interface RoleType {
    id: number;
    role_name: string;
  }
  const roleEditData = useSelector(
    (state: RootState) => state.ui.editRoleOnRoleMenuModal.data
  );

  // Form state
  const [formData, setFormData] = useState<Role>({
    id: 0,
    role_name: "",
    role_sort_name: "",
    role_type_id: 0,
    is_active: true,
  });

  // Fetch all role types for dropdown
  const { data: rolesData, isLoading: rolesLoading, isError: rolesError } = useQuery({
    queryKey: ["allroles"],
    queryFn: async () =>
      await fetchAllRolesDataApi({
        method: "GET",
        urlEndpoint: "/role/roles",
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  useEffect(() => {
    if (roleEditData) {
      setFormData({
        id: roleEditData.id,
        role_name: roleEditData.role_name,
        role_sort_name: roleEditData.role_sort_name,
        role_type_id: roleEditData.role_type_id,
        is_active: roleEditData.is_active,
      });
    }
  }, [roleEditData]);
  const editRole = async (role_id: number, updatedData: any) => {
    try {
      const payload = {
        role_name: updatedData.role_name,
        role_sort_name: updatedData.role_sort_name,
        role_type_id: updatedData.role_type_id,
        is_active: true,
      };

      const response = await EditRolesApi({
        method: "PUT",
        urlEndpoint: `/clientrole/client-roles/${role_id}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(payload),
      });

      return response?.data;
    } catch (error: any) {
      console.error("Error updating role:", error.response?.data || error.message);
      throw error;
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role_name.trim()) {
      toast.error("Role name cannot be empty");
      return;
    }

    try {
      await editRole(formData.id, formData);
      toast.success("Role Updated Successfully", {
        style: { backgroundColor: "#28a745", color: "white", border: "none" },
      });

      queryClient.invalidateQueries(); // Refresh roles list
      dispatch(hideEditRoleForm());
    } catch (error: any) {
      toast.error("Error updating role", {
        style: { backgroundColor: "#dc3545", color: "white", border: "none" },
      });
    }
  };
  const handleModalClose = () => dispatch(hideEditRoleForm());

  return (
    <div className="fixed top-0 left-0 h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto z-10">
      <div className="flex flex-col gap-2 w-full md:w-[25rem] h-auto bg-white dark:bg-[#E5E5E5] px-5 py-4 rounded-md dark:border dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h6 className="text-[14px] font-semibold text-[var(--blue)]">Edit Role</h6>
          <button onClick={handleModalClose} className="dark:text-black">
            <X size={18} />
          </button>
        </div>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          {/* Role ID (Disabled) */}
          <input
            type="number"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-500"
            value={formData.id}
            disabled
          />
          <input
            type="text"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="Role Name"
            value={formData.role_name}
            onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
            required
          />
          <input
            type="text"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="Role Short Name"
            value={formData.role_sort_name}
            onChange={(e) => setFormData({ ...formData, role_sort_name: e.target.value })}
            required
          />
          <select
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            value={formData.role_type_id}
            onChange={(e) => setFormData({ ...formData, role_type_id: Number(e.target.value) })}
            required
          >
            {rolesLoading ? (
              <option disabled>Loading...</option>
            ) : rolesError ? (
              <option disabled>Something went wrong</option>
            ) : (
              rolesData?.data.items.map((role: RoleType) => (
                <option value={role.id} key={role.id}>{role.role_name}</option>
              ))
            )}
          </select>
          <div className="flex gap-4 mt-3 justify-end">
            <button
              className="px-4 py-0.5 bg-[var(--red)] text-white text-[12px] rounded-[5px] dark:text-black"
              type="button"
              onClick={handleModalClose}
            >
              Cancel
            </button>

            <button
              className="px-4 py-0.5 bg-[var(--blue)] text-white text-[12px] rounded-[5px] dark:text-black"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNewRoleModal;
