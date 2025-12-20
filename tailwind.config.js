/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
                textPrimary: 'rgb(var(--color-text-primary) / <alpha-value>)',
                textMuted: 'rgb(var(--color-text-muted) / <alpha-value>)',
                'app-bg': 'rgb(var(--color-app-bg) / <alpha-value>)',
                card: 'rgb(var(--color-card) / <alpha-value>)',
                border: 'rgb(var(--color-border) / <alpha-value>)',
                success: 'rgb(var(--color-success) / <alpha-value>)',
                warning: 'rgb(var(--color-warning) / <alpha-value>)',
                error: 'rgb(var(--color-error) / <alpha-value>)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
