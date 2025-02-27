"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Role } from "@/app/models/auth";
import { useRouter } from "next/navigation";

export const GovernanceSelectPopUp = () => {
  const router = useRouter();
  const governanceData = Cookies.get("roles_by_governance");
  if (!governanceData) return;
  const parsedGovernanceData = JSON.parse(governanceData);
  const governanceKeys = Object.keys(parsedGovernanceData);

  // select handler
  const handleSelect = (selectedGovernanceKey: string) => {
    const selectedGovernance = parsedGovernanceData[selectedGovernanceKey];
    if (!selectedGovernance) return;

    Cookies.set("selected_governance", selectedGovernance);
    router.replace("/home/dashboard");
  };

  return (
    <div className="fixed h-full w-full bg-black/30 flex justify-center items-center">
      <div className="flex flex-col gap-6 w-full md:w-[30rem] h-auto bg-white px-5 py-4 rounded-md">
        <h6 className="text-xl font-semibold">Select the governance</h6>
        <div className="flex flex-col gap-3 h-80 overflow-y-auto">
          {governanceKeys.map((governanceKey: string, index: number) => (
            <button
              key={index}
              className="flex justify-between items-center px-4 py-5 border border-grey-300 rounded-lg"
              onClick={() => handleSelect(governanceKey)}
            >
              <h6>{governanceKey}</h6>
              <p>arrow</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
