import { UserManagement } from "@/app/home/role-user-management/create-update-users/page";
import { hideNewUserAddForm } from "@/lib/global-redux/features/uiSlice";
import { RootState } from "@/lib/global-redux/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddNewUserModal = () => {
  const dispatch = useDispatch();
  const userEditData = useSelector(
    (state: RootState) => state.ui.addNewUserOnRoleMenuModal.data
  );
  const [formData, setFormData] = useState<UserManagement>(
    userEditData
      ? userEditData
      : {
        name: "",
        email_id: "",
        governance: "",
        role: "",
        status: "",
      }
  );
  const handleModalClose = () => dispatch(hideNewUserAddForm());

  return (
    <div className="fixed top-0 -left-0 h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto z-10">
      <div className="flex flex-col gap-2 w-full md:w-[25rem] h-auto bg-white dark:bg-[#E5E5E5] px-5 py-4 rounded-md dark:border dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h6 className="text-[14px] font-semibold text-[var(--blue)]">
            {userEditData ? "Edit User" : "Add New User"}
          </h6>
          <button onClick={handleModalClose} className="dark:text-black">X</button>
        </div>
        <form className="flex flex-col gap-2">
          <input
            type="text"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="Email Id"
            value={formData.email_id}
            onChange={(e) =>
              setFormData({ ...formData, email_id: e.target.value })
            }
          />
          <select
            value={formData.governance}
            onChange={(e) =>
              setFormData({ ...formData, governance: e.target.value })
            }
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
          >
            <option value="">Select Governance</option>
            <option value="Admin">Cyber Security</option>
            <option value="User">Governance 2</option>
            <option value="Manager">Governance 3</option>
          </select>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
          >
            <option value="">Select Role</option>
            <option value="Viewer">Admin</option>
            <option value="Editor">Auditor</option>
            <option value="Contributor">Doer</option>
          </select>
          <div className="flex items-center gap-7">
            <p className="text-[11px] dark:text-black">Status</p>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="newUserFormStatus"
                id="newUserActiveStatus"
                className="text-[13px] dark:bg-white dark:border-white dark:checked:bg-white dark:checked:border-white"
              />


              <label htmlFor="newUserActiveStatus" className="text-[11px] dark:text-black">
                Active
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="newUserFormStatus"
                id="newUserInactiveStatus"
                className="text-[13px]"
              />
              <label htmlFor="newUserInactiveStatus" className="text-[11px] dark:text-black">
                Inactive
              </label>
            </div>
          </div>
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
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUserModal;
