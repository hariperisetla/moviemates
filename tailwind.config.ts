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

      backgroundImage: {
        "radial-bg":
          //"radial-gradient(at center, rgba(205, 183, 238, 0.8), rgba(255, 255, 255, 0.3))",
          "radial-gradient(at center, rgba(85, 52, 138, 0.01), rgba(205, 183, 238, 0.5))",
      },
    },
  },
  plugins: [],
};
export default config;
