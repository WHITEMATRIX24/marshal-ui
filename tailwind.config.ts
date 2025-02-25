import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        textcolorblue: "#0079ff",
      },
      backgroundColor: {
        colorblue: "#0079ff",
        greycomponentbg: "#f2f2f2",
      },
    },
  },
  plugins: [],
} satisfies Config;
