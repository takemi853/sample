import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1976d2",
          dark: "#004ba0",
          light: "#63a4ff",
        },
        secondary: {
          DEFAULT: "#f57c00",
          dark: "#bb4d00",
          light: "#ffad42",
        },
      },
      boxShadow: {
        card: "0 2px 4px rgba(0,0,0,0.1)",
        "card-hover": "0 4px 8px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
