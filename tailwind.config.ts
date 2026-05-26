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
        ldb: {
          forest: "#2C3B1F",
          "forest-mid": "#3D5428",
          moss: "#556B2F",
          sage: "#8A9E6D",
          stone: "#B5A894",
          sand: "#E8DFC8",
          cream: "#F5F0E8",
          dark: "#1A1F14",
          "warm-gray": "#6B6B63",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
