import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",     // dark navy
        accent: "#22c55e",      // green highlight
        glow: "#3b82f6",        // blue badge
      },
    },
  },
  plugins: [
    typography,
  ],

  animation: {
  slowZoom: "slowZoom 10s linear infinite",
},

keyframes: {
  slowZoom: {
    "0%": { transform: "scale(1)" },
    "100%": { transform: "scale(1.08)" },
  },
},

};

