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
    <div className="fixed top-[50%] left-[50%] z-30 -translate-x-[50%] -translate-y-[50%] flex flex-col items-center gap-4 bg-white px-4 py-2 border w-96">
      <h6 className="font-bold text-xl">Confirm Delete</h6>
      <div className="flex flex-col gap-3">
        <p className="">Are you sure about it?</p>
        <div className="flex gap-8 justify-center">
          <Link
            href="/home/dashboard/deleteaccount"
            className="px-3 py-2 bg-red-600 rounded-md text-white"
          >
            Yes
          </Link>
          <button
            onClick={handleCancelClick}
            className="px-3 py-2 bg-green-600 rounded-md text-white"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCnfModal;
