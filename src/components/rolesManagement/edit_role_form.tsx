import { Role } from "@/app/home/role-user-management/create-update-roles/page";
import { hideEditRoleForm } from "@/lib/global-redux/features/uiSlice";
import { RootState } from "@/lib/global-redux/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { EditRolesApi } from "@/services/apis";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Inside the component

const EditNewRoleModal = () => {
  const dispatch = useDispatch();
  const roleEditData = useSelector(
    (state: RootState) => state.ui.editRoleOnRoleMenuModal.data
  );
  const [formData, setFormData] = useState<Role>(
    roleEditData || {
      id: 0,
      role_name: "",
      is_active: true,
    }
  );

  const queryClient = useQueryClient();
  const editRole = async (role_id: number, updatedData: any) => {
    const token = Cookies.get("access_token");

    try {
      const payload = {
        role_name: updatedData.role_name,
        is_active: true
      };

      console.log("Request payload:", payload); // Debug log

      const response = await EditRolesApi({
        method: "PUT",
        urlEndpoint: `/role/roles/${role_id}`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', // Crucial header
          'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(payload), // Explicitly stringify
      });

      return response?.data;
    } catch (error: any) {
      console.error("Full error details:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  };
  const handleModalClose = () => dispatch(hideEditRoleForm());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id) {
      console.error("No role ID found for editing");
      return;
    }

    try {
      const result = await editRole(formData.id, {
        role_name: formData.role_name

      });
      console.log("Update successful:", result);
      toast.success("Role Updated Successfully", {
        style: { backgroundColor: "#28a745", color: "white", border: "none" },
      });
      queryClient.invalidateQueries();
      dispatch(hideEditRoleForm());
    } catch (error: any) {
      toast.error("Error updating role", {
        style: { backgroundColor: "#dc3545", color: "white", border: "none" },
      });

      console.error("Detailed update error:", {
        message: error.message,
        responseData: error.response?.data,
        status: error.response?.status
      });
      // Show user-friendly error message based on error.response?.data
    }
  };


  return (
    <div className="fixed top-0 left-0 h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto z-10">
      <div className="flex flex-col gap-2 w-full md:w-[25rem] h-auto bg-white dark:bg-[#E5E5E5] px-5 py-4 rounded-md dark:border dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h6 className="text-[14px] font-semibold text-[var(--blue)]">
            {roleEditData ? "Edit Role" : "Add New Role"}
          </h6>
          <button onClick={handleModalClose} className="dark:text-black">X</button>
        </div>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input
            type="number"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="Role Id"
            value={formData.id}
            onChange={(e) =>
              setFormData({ ...formData, id: Number(e.target.value) })
            }
            disabled
          />

          <input
            type="text"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="Role Name"
            value={formData.role_name}
            onChange={(e) =>
              setFormData({ ...formData, role_name: e.target.value })
            }
          />
          {/* 
          <select
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            value={formData.is_active ? "active" : "inactive"}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.value === "active" })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select> */}





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
