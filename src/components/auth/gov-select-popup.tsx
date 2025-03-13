"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Role } from "@/models/auth";
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
  const governanceData = Cookies.get("roles_by_governance");
  if (!governanceData) return;
  const parsedGovernanceData = JSON.parse(governanceData);
  const governanceKeys = Object.keys(parsedGovernanceData);
  const isPopupVisible = useSelector(
    (state: RootState) => state.ui.governanceModalState
  );
  const dispatch = useDispatch();

  // select handler
  const handleSelect = (selectedGovernanceKey: string) => {
    const selectedGovernance = parsedGovernanceData[selectedGovernanceKey];
    if (!selectedGovernance) return;

    Cookies.set("selected_governance", JSON.stringify(selectedGovernance));
    Cookies.set("selected_governance_key", selectedGovernanceKey);
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
      if (governanceKeys.length === 1) {
        handleSelect(governanceKeys[0]);
      }
    }
  }, [isPopupVisible]);

  if (!isPopupVisible) return;

  return (
    <div className="fixed h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto">
      <div className="flex flex-col gap-6 w-full md:w-[30rem] h-auto bg-white dark:bg-black px-5 py-4 rounded-md dark:border dark:border-white">
        <h6 className="text-xl font-semibold">Select the governance</h6>
        <div className="flex flex-col gap-3 h-80 overflow-y-auto">
          {governanceKeys.length > 0 ? (
            governanceKeys.map((governanceKey: string, index: number) => (
              <button
                key={index}
                className="flex justify-between items-center px-4 py-5 border border-grey-300 rounded-lg"
                onClick={() => handleSelect(governanceKey)}
              >
                <h6 className="dark:text-white">{governanceKey}</h6>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ))
          ) : (
            <p>No governance found</p>
          )}
        </div>
      </div>
    </div>
  );
};
