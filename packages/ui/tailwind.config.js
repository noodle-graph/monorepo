/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
        colors: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
            disabled: '#475569',
            highlight: '#fef9c3',
        },
        backgroundColor: {
            darker: '#080d17',
            primary: '#0f172a',
            secondary: '#1e293b',
        },
    },
    plugins: [],
};
