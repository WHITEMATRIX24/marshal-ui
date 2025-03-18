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
      <div className="bg-white p-4 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center">
          <h6 className="text-[14px] font-semibold py-2" >Are you sure?</h6>
          <button onClick={handleCancelClick}>X</button>
        </div>
        <p className="text-gray-600 mb-4 text-[12px]">
          You are about to delete this item. This action cannot be undone.
        </p>

        <div className="flex gap-4 mx-auto mt-3 justify-end">
          <button
            onClick={handleCancelClick}
            className="px-4 py-0.5 bg-transparent border border-black text-black text-[12px] rounded-[5px]"
            type="reset"
          >
            Cancel
          </button>
          <button className="px-4 py-0.5 bg-black text-white border-black text-[12px] rounded-[5px]"
            type="submit">
            {"Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCnfModal;
