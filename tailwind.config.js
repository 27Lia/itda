/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customGray: "#272A36",
        customPink: "#F27EAA",
        customSoftPink: "#ED5E93",
      },
    },
  },
  plugins: [],
};
