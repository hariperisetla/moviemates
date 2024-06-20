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
        primary: "#6A49A0",
        secondary: "#E8DAFF",
        gray: "#949494",
        lightGray: "#D2CCCC",
      },
    },
  },
  plugins: [],
};
export default config;
