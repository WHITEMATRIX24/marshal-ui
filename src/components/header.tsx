"use client";


import { Bell, Settings, MoreVertical } from "lucide-react";
import { useState } from "react";
import { SettingsPopUp } from "./settingsPopup/settingsPopUp";
import ChangeThemeButton from "./ui/chnage-theme-btn";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/global-redux/store";
import BreadCrumbsProvider from "./ui/breadCrumbsProvider";

const Header = () => {

  const [showSettings, setShowSettings] = useState(false);
  const mainBreadcrumb = useSelector((state: RootState) => state.ui.mainBreadcrumb);



  return (
    <header >
      <div className="flex items-center justify-between w-full px-4">
        <h1 className="roboto-text text-[28px] font-[700] capitalize ">
          {mainBreadcrumb}
        </h1>
        <div className="flex items-center gap-5 mr-4">
          <Bell className="w-[18px] h-[18px] cursor-pointer" />
          <ChangeThemeButton />
          <Settings
            className="w-[18px] h-[18px] cursor-pointer"
            onClick={() => setShowSettings(true)} // Show popup on click
          />
          <MoreVertical className="w-[18px] h-[18px] cursor-pointer" />
        </div>
      </div>


      {showSettings && <SettingsPopUp onClose={() => setShowSettings(false)} />}
    </header>
  );
};

export default Header;
