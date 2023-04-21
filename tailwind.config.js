/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */

const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
const addVariablesForColors = ({ addBase, theme }) => {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1360px",
      },
    },
    screens: {
      minscreen: "340px",
      xs3: "420px",
      xs: "460px",
      xs2: "500px",
      ...defaultTheme.screens,
    },
    extend: {
      boxShadow: {
        red: "0px 4px 12px 0 rgba(174, 9, 9, 0.3)",
        orange: "0px 4px 12px 0 rgba(229, 141, 8, 0.3)",
        top: "20px 35px 60px -15px rgba(0, 0, 0, 0.3)",
        notLeft: "3px 3px 5px -4px rgba(0, 0, 0, 0.3)",
      },
      fontSize: {
        xs2: "0.6rem",
      },
      colors: {
        "surface-bg": "#F7F8FA",
        "text-primary": "#393939",
        "tab-bg": "#F6F6F8",
        primary: "#E50815",
        secondary: "#E58D08",
        darkOutline: "#78808c",
        lightOutline: "#eef2f6",
        blueOutline: "#6585DF",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
    },
    fontFamily: {
      sans: "var(--rubik-font)",
      //   sans: ["var(--font-rubik)", ...fontFamily.sans],
      number: "var(--quicksand-font)",
      //   baloo: ["baloo-2", "cursive"],
      //   quicksand: ["Quicksand", "sans-serif"],
      catamaran: "var(--main-font)",
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
    },
    linearBorderGradients: () => ({
      colors: {
        "light-green": [colors.emerald[500], colors.green[500], colors.lime[500]],
        "light-blue": [colors.teal[500], colors.emerald[500], colors.green[500]],
        purple: [colors.blue[500], colors.pink[500], colors.purple[500]],
        gray: [colors.gray[300], colors.slate[100], colors.gray[300]],
      },
      background: {
        white: "#fff",
      },
    }),
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-animate"),
    addVariablesForColors,
  ],
};
