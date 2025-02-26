"use client";
import Link from "next/link";
import React from "react";

export const GovernanceSelectPopUp = () => {
  return (
    <div className="fixed h-full w-full bg-black/30 flex justify-center items-center">
      <div className="flex flex-col gap-6 w-full md:w-[30rem] h-auto bg-white px-5 py-4 rounded-md">
        <h6 className="text-xl font-semibold">Select the governance</h6>
        <Link
          href={"/home/dashboard"}
          className="flex flex-col h-80 overflow-y-auto"
        >
          <button className="flex justify-between items-center px-4 py-5 border border-grey-300 rounded-lg">
            <h6>CyberSecurity</h6>
            <p>role</p>
          </button>
        </Link>
      </div>
    </div>
  );
};
