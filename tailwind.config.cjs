/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'oxford': '#10162E',
        'raisin': '#2A2828',
        'ivory': '#FBFFF1',
        'acc3': '#04f06a',
        'acc4': '#63d2ff',
        'acc5': '#009ffd', 
        'RB': '#e76f51',
        'WR': '#f4a261',
        'QB': '#2a9d8f',
        'TE': '#264653',
        'K': '#e9c46a',
      },
    },
  },
  plugins: [require("daisyui")],
  safelist: [{
    pattern: /(bg|text|border)-(QB|RB|WR|TE|K)/
}

]
}
