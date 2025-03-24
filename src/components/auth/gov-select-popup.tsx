"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Role, UserGovernanceStructure } from "@/models/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/global-redux/store";
import {
  hideGovernanceModal,
  showGovernanveModal,
} from "@/lib/global-redux/features/uiSlice";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const GovernanceSelectPopUp = () => {
  const router = useRouter();
  const governanceData = Cookies.get("roles");
  if (!governanceData) return;
  const parsedGovernanceData = JSON.parse(governanceData);
  // const governanceKeys = Object.keys(parsedGovernanceData);
  const isPopupVisible = useSelector(
    (state: RootState) => state.ui.governanceModalState
  );
  const dispatch = useDispatch();

  // select handler
  const handleSelect = (selectedGovernance: UserGovernanceStructure) => {
    if (!selectedGovernance) return;

    Cookies.set("selected_governance", JSON.stringify(selectedGovernance));
    Cookies.set("login_popup_initila_render", JSON.stringify(false));
    dispatch(hideGovernanceModal());
    router.refresh();
  };

  useEffect(() => {
    const cookieValue = Cookies.get("login_popup_initila_render");
    const isInitialRender = cookieValue === "true";
    if (isInitialRender) dispatch(showGovernanveModal());
    else dispatch(hideGovernanceModal());
  }, [Cookies]);

  useEffect(() => {
    if (isPopupVisible) {
      if (parsedGovernanceData.length === 1) {
        handleSelect(parsedGovernanceData[0]);
      }
    }
  }, [isPopupVisible]);

  if (!isPopupVisible) return;

  return (
    <div className="fixed h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto">
      <div className="flex flex-col gap-4 w-full md:w-[30rem] h-auto bg-white dark:bg-black px-5 py-4 rounded-md dark:border dark:border-gray-600">
        <h6 className="text-[16px] font-semibold">Select the governance</h6>
        <div className="flex flex-col gap-3 max-h-90 overflow-y-auto">
          {parsedGovernanceData.length > 0 ? (
            parsedGovernanceData.map(
              (governanceKey: UserGovernanceStructure, index: number) => (
                <button
                  key={index}
                  className="flex justify-between items-center px-2 py-1 border-b border-grey-300 "
                  onClick={() => handleSelect(governanceKey)}
                >
                  <h6 className="dark:text-white text-[11px]">
                    {governanceKey.governance_name}
                  </h6>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[11px]"
                  />
                </button>
              )
            )
          ) : (
            <p>No governance found</p>
          )}
        </div>
      </div>
    </div>
  );
};
