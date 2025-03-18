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
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-3">Are you sure?</h2>
        <p className="text-gray-600 mb-4 text-sm">
          You are about to delete this item. This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancelClick}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
            {"Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCnfModal;
