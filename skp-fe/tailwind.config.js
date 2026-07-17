/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DMSans_400Regular"],
        "sans-semibold": ["DMSans_600SemiBold"],
        "sans-bold": ["DMSans_700Bold"],
      },
      colors: {
        brand: {
          DEFAULT: "#007FFF",
          press: "#0568D6",
          tint: "#E5F1FF",
        },
        ink: "#1E2430",
        slate: "#5B6472",
        mist: "#DCE1E8",
        cloud: "#F5F7FA",
        success: {
          DEFAULT: "#3E7A4C",
          tint: "#E9F4EC",
        },
        warning: {
          DEFAULT: "#B9740E",
          tint: "#FBF0DD",
        },
        danger: {
          DEFAULT: "#D62828",
          tint: "#FCE8E8",
        },
      },
    },
  },
  plugins: [],
};