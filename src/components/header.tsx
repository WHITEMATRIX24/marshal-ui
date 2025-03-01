"use client";

import { usePathname } from "next/navigation";
import { Bell, Settings, MoreVertical } from "lucide-react";
import { useState } from "react";
import { SettingsPopUp } from "./settingsPopup/settingsPopUp";


const Header = () => {
    const pathname = usePathname();
    const [showSettings, setShowSettings] = useState(false);

    const getPageTitle = (path: string) => {
        const segments = path.split("/").filter(Boolean);
        return segments.length > 0 ? segments[segments.length - 1].replace(/-/g, " ") : "Dashboard";
    };

    return (
        <header className="flex items-center justify-between w-full">
            <h1 className="roboto-text text-[28px] font-medium capitalize px-4">
                {getPageTitle(pathname)}
            </h1>
            <div className="flex items-center gap-5 mr-4">
                <Bell className="w-[18px] h-[18px] cursor-pointer" />
                <Settings
                    className="w-[18px] h-[18px] cursor-pointer"
                    onClick={() => setShowSettings(true)} // Show popup on click
                />
                <MoreVertical className="w-[18px] h-[18px] cursor-pointer" />
            </div>

            {showSettings && <SettingsPopUp onClose={() => setShowSettings(false)} />}
        </header>
    );
};

export default Header;
