/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      primary: "#722630", // destaque, botões, ações principais
      secondary: "#000000", // uso estratégico em textos ou contornos
      background: "#000000", // fundo geral
      cards: "#000000", // cards e containers
      containers: "#191919",
      text: "#CECECE", // textos principais
      textMuted: "#B0B0C0", // textos secundários, data, descrição etc.
      border: "#3A3A4D", // bordas suaves
      inputBg: "#101010", // fundo de inputs
      placeholder: "#6C6C80", // placeholder dos campos
      buttons: "#ffffff",
      buttonsBorder: "151515",
      buttonsHover: "#facc15", // hover do botão primário (versão mais clara do primary)
      secondaryButtons: "#111111",
      secondaryButtonsHover: "#0B0B0B",
      links: "#facc15", // links e interações
    },
    boxShadow: {
      "custom-opacity": "-20px 20px 0px",
      "custom-opacityButton": "-5px 5px 0px",
    },
    fontFamily: {
      mainFont: ["Roboto", "sans-serif"],
    },
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
