import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1269e2",
        "primary-dark": "#0f5bbd",
        "seller-primary": "#EAB308",
        "seller-primary-hover": "#CA8A04",
        "background-light": "#ffffff",
        "background-dark": "#101822",
        "neutral-light": "#f6f7f8",
        surface: "#ffffff",
        "border-color": "#e2e8f0",
        "text-main": "#1e293b",
        "text-muted": "#64748b"
      },
      fontFamily: {
        display: ["Public Sans", "sans-serif"],
        body: ["Noto Sans", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
