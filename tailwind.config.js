/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      primary: "#722630",
      secondary: "#000000",
    },
    boxShadow: {
      "custom-opacity": "-20px 20px 0px",
      "custom-opacityButton": "-5px 5px 0px",
    },
    fontFamily: {},
    fontSize: {
      paragraph1: "0.625rem",
      paragraph2: "0.75rem",
      paragraph3: "0.875rem",
      paragraph4: "1rem",
      paragraph5: "1.125rem",
      title1: "1.25rem",
      title2: "1.375rem",
      title3: "1.5rem",
      title4: "1.875rem",
      title5: "2.25rem",
      title6: "3rem",
      title7: "3.5rem",
    },
    spacing: {},
    screens: {
      phone1: "320px",
      phone2: "375px",
      phone3: "425px",
      tablet1: "640px",
      tablet2: "768px",
      desktop1: "1024px",
      desktop2: "1280px",
      desktop3: "1440px",
    },
    keyframes: {},
    animation: {},
  },
};
