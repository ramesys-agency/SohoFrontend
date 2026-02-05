/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Convert this to a proper glob string array
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Urbanist"],
        Urbanist: ["Urbanist"],
        "Urbanist-Thin": ["Urbanist-Thin"],
        "Urbanist-ExtraLight": ["Urbanist-ExtraLight"],
        "Urbanist-Light": ["Urbanist-Light"],
        "Urbanist-Medium": ["Urbanist-Medium"],
        "Urbanist-SemiBold": ["Urbanist-SemiBold"],
        "Urbanist-Bold": ["Urbanist-Bold"],
        Classyvogue: ["Classyvogue"],
      },
    },
  },
  plugins: [],
};
