"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface SettingsPopUpProps {
  onClose: () => void;
}

export const SettingsPopUp: React.FC<SettingsPopUpProps> = ({ onClose }) => {
  const { setTheme, theme } = useTheme();

  //   theme toggler
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

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
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
    >
      <div className="flex flex-col gap-6 w-full md:w-[30rem] h-auto bg-white dark:bg-black px-5 py-4 rounded-md dark:border">
        <h6 className="text-xl font-semibold flex justify-between">
          Settings
          <button onClick={onClose} className="text-lg font-bold">
            ✖
          </button>
        </h6>
        <div className="h-80">
          <div className="flex justify-between items-center border px-3 py-2 rounded-md">
            <p>Chnage Theme</p>
            <button
              onClick={toggleTheme}
              className="relative border p-2 rounded-full dark:border-white"
            >
              {theme == "light" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] scale-0 transition-all dark:scale-100" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
