/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      'oxford': '#10162E',
      'raisin': '#2A2828',
      'ivory': '#FBFFF1',
      'acc3': '#04f06a',
      'acc4': '#63d2ff',
      'acc5': '#009ffd',
    },
    extend: {},
  },
  plugins: [require("daisyui")],
}
