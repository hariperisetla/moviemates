import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        libreBaskerville: ["Libre Baskerville", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#55348A",
        secondary: "#CCB7EE",
      },
    },
  },
  plugins: [],
};
export default config;
