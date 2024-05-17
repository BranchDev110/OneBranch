/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

// const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        c1: {
          DEFAULT: "#0066CC",
        },
        c2: {
          DEFAULT: "#00B894",
          100: "#ccf1ea",
        },
        c3: {
          DEFAULT: "#F2994A",
        },
        c4: {
          DEFAULT: "#EB5757",
        },
        c5: {
          DEFAULT: "#E0E0E0",
        },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      zIndex: {
        header: 1000,
        nav: 10100,
        overlay: 10500,
        menu: 10700,
        toggler: 10800,
        modal: 10900,
        notif: 11000,
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".max-w-unset": {
          "max-width": "unset",
        },
        ".max-h-unset": {
          "max-height": "unset",
        },
        ".h-unset": {
          height: "unset",
        },
        ".w-unset": {
          width: "unset",
        },
        ".center": {
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
        ".btwn": {
          display: "flex",
          "justify-content": "space-between",
          "align-items": "center",
        },
        ".end": {
          display: "flex",
          "justify-content": "flex-end",
          "align-items": "center",
        },
        ".start": {
          display: "flex",
          "align-items": "center",
        },
      });
    }),
  ],
};
