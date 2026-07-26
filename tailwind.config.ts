import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18181B",
        paper: "#FFFFFF",
        muted: "#F5F5F4",
        accent: {
          DEFAULT: "#A67C52",
          light: "#C29B76",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
export default config;
