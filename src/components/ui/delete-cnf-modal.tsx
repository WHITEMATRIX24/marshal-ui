"use client";
import Link from "next/link";
import React from "react";

const DeleteCnfModal = ({
  modalCloseHandler,
}: {
  modalCloseHandler: VoidFunction;
}) => {
  // handle click No
  const handleCancelClick = () => modalCloseHandler();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96  dark:bg-[#e5e5e5] dark:border dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h6 className="text-[14px] font-semibold text-[var(--blue)] py-2" >Are you sure?</h6>
          <button onClick={handleCancelClick} className="dark:text-black">X</button>
        </div>
        <p className="text-gray-600 mb-4 text-[12px] dark:text-black">
          You are about to delete this item. This action cannot be undone.
        </p>

        <div className="flex gap-4 mx-auto mt-3 justify-end">
          <button
            onClick={handleCancelClick}
            className="px-4 py-0.5 bg-[var(--red)] text-white text-[12px] rounded-[5px] dark:text-black "
            type="reset"
          >
            Cancel
          </button>
          <button className="px-4 py-0.5 bg-[var(--blue)] text-white  text-[12px] rounded-[5px] dark:text-black"
            type="submit">
            {"Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCnfModal;
