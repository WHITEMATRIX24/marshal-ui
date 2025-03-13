import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ChangeThemeButton = () => {
  const { setTheme, theme } = useTheme();

  //   theme toggler
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button onClick={toggleTheme} className="relative p-2 rounded-full">
      {theme == "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] scale-0 transition-all dark:scale-100" />
      )}
    </button>
  );
};

export default ChangeThemeButton;
