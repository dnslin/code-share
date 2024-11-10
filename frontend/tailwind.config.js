/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#ffffff',
                    dark: '#1a1a1a',
                },
                secondary: {
                    light: '#f3f4f6',
                    dark: '#111827',
                },
                accent: {
                    light: '#3b82f6',
                    dark: '#60a5fa',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-in': 'slideIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
    darkMode: 'class'
} 