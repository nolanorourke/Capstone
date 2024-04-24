/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'text': '#050315',
      'background': '#fafcfb',
      'primary': '#396643',
      'secondary': '#919e8e',
      'accent': '#c0c0c0',
      'muted': '#EBF4E6',
      'white': '#ffffff',
     }, 
     container: {
      center: true,
    },    
    extend: {
      backgroundImage: {
        'cooking': "url('/cooking.jpg')",
       },
       spacing: {
        'extra': '10rem',
       },
    },
  },
  plugins: [],
};
