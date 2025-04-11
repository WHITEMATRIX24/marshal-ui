import React from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const ChangeThemeButton = () => {
  const { setTheme, theme } = useTheme();

  //   theme toggler
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button onClick={toggleTheme} className="relative rounded-full pt-[2px]">
      {theme == "light" ? (
        <FontAwesomeIcon icon={faSun} className=" w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-600" />

      ) : (
        <FontAwesomeIcon icon={faMoon} className=" w-[18px] scale-0 transition-all dark:scale-100 text-yellow-400" />
      )}
    </button>
  );
};

export default ChangeThemeButton;
