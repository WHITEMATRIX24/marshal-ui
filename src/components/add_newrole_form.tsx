import { RoleManagement } from "@/app/home/role-user-management/create-update-roles/page";
import { hideNewRoleAddForm } from "@/lib/global-redux/features/uiSlice";
import { RootState } from "@/lib/global-redux/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddNewRoleModal = () => {
  const dispatch = useDispatch();
  const roleEditData = useSelector(
    (state: RootState) => state.ui.addNewRoleOnRoleMenuModal.data
  );
  const [formData, setFormData] = useState<RoleManagement>(
    roleEditData
      ? roleEditData
      : {
        role_name: "",
        role_id: "",
      }
  );

  const handleModalClose = () => dispatch(hideNewRoleAddForm());

  return (
    <div className="fixed top-0 -left-0 h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto z-10">
      <div className="flex flex-col gap-2 w-full md:w-[25rem] h-auto bg-white dark:bg-black px-5 py-4 rounded-md dark:border dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h6 className="text-[14px] font-semibold">
            {roleEditData ? "Edit Role" : "Add New Role"}
          </h6>
          <button onClick={handleModalClose}>X</button>
        </div>
        <form className="flex flex-col gap-2">
          <input
            type="text"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600"
            placeholder="Role Id"
            value={formData.role_id}
            onChange={(e) =>
              setFormData({ ...formData, role_id: e.target.value })
            }
          />
          <input
            type="text"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600"
            placeholder="Role Name"
            value={formData.role_name}
            onChange={(e) =>
              setFormData({ ...formData, role_name: e.target.value })
            }
          />

          <div className="flex gap-4 mt-3 justify-end">
            <button
              className="px-4 py-0.5 bg-transparent border border-black text-black text-[12px] rounded-[5px] dark:text-white dark:bg-[var(--table-bg-even)]"
              type="reset"
            >
              Cancel
            </button>

            <button
              className="px-4 py-0.5 bg-black text-white border-black text-[12px] rounded-[5px] dark:text-white dark:bg-[var(--table-bg-even)] "
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

export default AddNewRoleModal;
