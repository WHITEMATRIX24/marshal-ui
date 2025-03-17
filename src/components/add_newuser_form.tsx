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
          <h6 className="text-xl font-semibold">New User</h6>
          <button onClick={handleModalClose}>close</button>
        </div>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            className="px-4 py-3 border outline-none rounded-md border-gray-300"
            placeholder="Name"
          />
          <input
            type="text"
            className="px-4 py-3 border outline-none rounded-md border-gray-300"
            placeholder="Name"
          />
          <input
            type="text"
            className="px-4 py-3 border outline-none rounded-md border-gray-300"
            placeholder="Name"
          />
          <input
            type="text"
            className="px-4 py-3 border outline-none rounded-md border-gray-300"
            placeholder="Name"
          />
          <div className="flex items-center gap-7">
            <p>status</p>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="newUserFormStatus"
                id="newUserActiveStatus"
              />
              <label htmlFor="newUserActiveStatus">Active</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="newUserFormStatus"
                id="newUserInactiveStatus"
              />
              <label htmlFor="newUserInactiveStatus">Inactive</label>
            </div>
          </div>
          <div className="flex gap-7 mx-auto mt-10">
            <button
              className="px-4 py-2 bg-red-700 text-white rounded-lg"
              type="reset"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-700 text-white rounded-lg"
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
