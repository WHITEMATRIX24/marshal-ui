"use client";


import { Bell, Settings, MoreVertical } from "lucide-react";
import { useState } from "react";
import { SettingsPopUp } from "./settingsPopup/settingsPopUp";
import ChangeThemeButton from "./ui/chnage-theme-btn";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/global-redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faGear } from "@fortawesome/free-solid-svg-icons";


const Header = () => {

  const [showSettings, setShowSettings] = useState(false);
  const mainBreadcrumb = useSelector((state: RootState) => state.ui.mainBreadcrumb);



  return (
    <header >
      <div className="flex items-center justify-between w-full px-4">
        <h1 className="roboto-text text-[22px] font-[700] capitalize text-[#068cca] dark:text-[#6bc2e6]">
          {mainBreadcrumb}
        </h1>
        <div className="flex items-center gap-2 mr-4">
          <FontAwesomeIcon className="w-[18px] cursor-pointer text-[#7c9299] dark:text-[#e5e5e5]" icon={faBell} />
          <ChangeThemeButton />
          <FontAwesomeIcon icon={faGear} className="w-[18px] cursor-pointer text-[#7c9299] dark:text-[#e5e5e5]" onClick={() => setShowSettings(true)} />
          <MoreVertical className="w-[18px] cursor-pointer text-[#7c9299] dark:text-[#e5e5e5]" />
        </div>
      </div>


      {showSettings && <SettingsPopUp onClose={() => setShowSettings(false)} />}
    </header>
  );
};

export default Header;
