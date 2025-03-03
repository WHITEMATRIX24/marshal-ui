"use client";
import React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";
const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);

import { type ThemeProviderProps } from "next-themes";
import dynamic from "next/dynamic";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export default ThemeProvider;
