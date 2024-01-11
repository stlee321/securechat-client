/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      flex: {
        2: "2 2 0%",
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",
      black: "#000000",
      "green-1": "#2A342C",
      "green-2": "#344E2E",
      "green-3": "#00D415",
      "green-4": "#A4FFAD",
      "green-5": "#00f719",
      "red-1": "#6C3B3B",
      "red-2": "#FF8989",
      "red-3": "#FF1E1E",
      "gray-1": "#232323",
      "gray-2": "#898989",
      "gray-3": "#D9D9D9",
    },
  },
  plugins: [],
};
