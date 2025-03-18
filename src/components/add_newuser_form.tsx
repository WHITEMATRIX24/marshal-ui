import { hideNewUserAddForm } from "@/lib/global-redux/features/uiSlice";
import React from "react";
import { useDispatch } from "react-redux";

const AddNewUserModal = () => {
  const dispatch = useDispatch();

  const handleModalClose = () => dispatch(hideNewUserAddForm());

  return (
    <div className="fixed top-0 -left-0 h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto">
      <div className="flex flex-col gap-10 w-full md:w-[30rem] h-auto bg-white dark:bg-black px-5 py-4 rounded-md dark:border dark:border-white">
        <div className="flex justify-between items-center">
          <h6 className="text-[14px] font-semibold">Add New User</h6>
          <button onClick={handleModalClose}>X</button>
        </div>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            className="px-2 py-2 border outline-none rounded-md text-[11px] border-gray-300"
            placeholder="Name"
          />
          <input
            type="text"
            className="px-2 py-2 border outline-none rounded-md text-[11px] border-gray-300"
            placeholder="Email Id"
          />
          <select className="px-2 py-2 border outline-none rounded-md text-[11px] border-gray-300">
            <option value="">Select Governance</option>
            <option value="Admin">Cyber Security</option>
            <option value="User">Governance 2</option>
            <option value="Manager">Governance 3</option>
          </select>
          <select className="px-2 py-2 border outline-none rounded-md text-[11px] border-gray-300">
            <option value="">Select Role</option>
            <option value="Viewer">Admin</option>
            <option value="Editor">Auditor</option>
            <option value="Contributor">Doer</option>
          </select>
          <div className="flex items-center gap-7">
            <p className="text-[13px]">Status</p>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="newUserFormStatus"
                id="newUserActiveStatus"
                className="text-[13px]"
              />
              <label htmlFor="newUserActiveStatus" className="text-[13px]">Active</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="newUserFormStatus"
                id="newUserInactiveStatus"
                className="text-[13px]"
              />
              <label htmlFor="newUserInactiveStatus" className="text-[13px]">Inactive</label>
            </div>
          </div>
          <div className="flex gap-7 mx-auto mt-3">
            <button
              className="px-4 py-1 bg-red-700 text-white text-[14px] rounded-[5px]"
              type="reset"
            >
              Cancel
            </button>
            <button
              className="px-4 py-1 bg-green-700 text-white text-[14px] rounded-[5px]"
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
