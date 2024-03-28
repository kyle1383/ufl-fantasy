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
        'black': '#000000',
        'gray-900': '#0a0a0a',
        'gray-800': '#090A0B',
        'gray-700': '#121416',
        'gray-600': '#1d1d1d',
        'gray-500': '#2a2a2a',
        'gray-400': '#383838',
        'gray-300': '#4f4f4f',
        'gray-200': '#828282',
        'gray-100': '#bcbcbc',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      ufl: {
        "primary": "#f95738",
        "secondary": "#ee964b",
        "accent": "#f4d35e",
        "neutral": "#FFEBB7",
        /*"base-100": "#0d3b66",*/
        
      },
    },]
  },
  safelist: [{
    pattern: /(bg|text|border|from)-(QB|RB|WR|TE|K|acc3|acc4|acc5|raisin|ivory|oxford)/
  }]
}
