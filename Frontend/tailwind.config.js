/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-once": {
          "0%, 100%": { transform: "translateY(0)", animationTimingFunction: "ease-in-out" },
          "50%": { transform: "translateY(-24px)" },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-50%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(50%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        "fade-up": "fade-up 1s ease-out forwards",
        "bounce-once": "bounce-once 0.8s ease-out 1",
        "slideInLeft": 'slideInLeft 0.5s ease-out forwards',
        "slideInRight": 'slideInRight 0.5s ease-out forwards',
      },
    },
    plugins: [],
  }
}