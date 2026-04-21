/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#0EA5E9",
        surface: "#FFFFFF",
        background: "#F8FAFC",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        data: ['var(--font-data)', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      }
    },
  },
  plugins: [],
};
