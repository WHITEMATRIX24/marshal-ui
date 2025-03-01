"use client";

import { useEffect } from "react";

interface SettingsPopUpProps {
    onClose: () => void;
}

export const SettingsPopUp: React.FC<SettingsPopUpProps> = ({ onClose }) => {
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if ((event.target as HTMLElement).id === "settings-popup-overlay") {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);

    return (
        <div
            id="settings-popup-overlay"
            className="fixed inset-0 bg-black/30 flex justify-center items-center z-101"
        >
            <div className="flex flex-col gap-6 w-full md:w-[30rem] h-auto bg-white px-5 py-4 rounded-md">
                <h6 className="text-xl font-semibold flex justify-between">
                    Settings
                    <button onClick={onClose} className="text-lg font-bold">✖</button>
                </h6>
                <div className="h-80">
                    Change Theme
                </div>
            </div>
        </div>
    );
};
