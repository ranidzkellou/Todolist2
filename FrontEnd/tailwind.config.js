import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './storybook/**/*.{js,jsx}', 
  ],
  theme: {
    extend: {
      colors: {
        customBlue: {
          lightest: '#F1F9FF',
          lighter: '#93D1FA',
          light: '#4DBEFF',
          DEFAULT: '#248AC9',
          dark: '#173E63',
        },
        websiteBack: "#F1F9FF",
        background: '#F0F9FF',
        bluemain:"#0190F8",

        priority: {
          high: {
            bg: '#DC2626',    
            text: '#FEE2E2',  
          },
          mid: {
            bg: '#EAB308',    
            text: '#FEFCE8',  
          },
          low: {
            bg: '#22C55E',    
            text: '#F0FDF4',  
          }
        },

        primary: '#F0F9FF', 
        secondary: '#0074BA',
        accent: '#003E78',
        orange:'#E86B00',
      },
      
      fontFamily: {
        main: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    tailwindScrollbar
  ],
}