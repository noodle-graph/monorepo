/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
        borderColor: {
            'text-primary': '#f1f5f9',
            'text-secondary': '#94a3b8',
            'bg-primary': '#0f172a',
            secondary: '#475569',
        },
        colors: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
            disabled: '#475569',
            danger: '#b91c1c',
        },
        backgroundColor: {
            darker: '#080d17',
            primary: '#0f172a',
            secondary: '#1e293b',
            danger: '#b91c1c',
        },
    },
    plugins: [],
};
