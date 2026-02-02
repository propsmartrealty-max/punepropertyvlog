/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f0f4ff',
                    100: '#e0eaff',
                    200: '#c5d9ff',
                    300: '#9dbfff',
                    400: '#6e9bff',
                    500: '#4071ff',
                    600: '#1a4bff',  // Royal Blue (Vibrant but not dark)
                    700: '#0033d6',
                    800: '#002aa8',  // Deep Royal
                    900: '#002585',  // Classic Corporate Blue (Softer than Navy)
                    950: '#00154a',
                },
                accent: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d', // Dark Green (Primary "Green Signal")
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                // Refine custom tokens
                navy: {
                    DEFAULT: '#1e3a8a', // Blue 900
                    light: '#1e40af',   // Blue 800
                },
                gold: {
                    DEFAULT: '#C5A059', // Champagne Gold
                    light: '#E5C985',   // Soft Gold
                    dark: '#997B30',    // Antique Gold
                },
                dark: {
                    DEFAULT: '#0f172a', // Slate-900 (Rich Navy)
                    card: '#1e293b',    // Slate-800
                    surface: '#334155', // Slate-700
                },
                // Keep standard colors that might be used
                blue: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8', // Compatibility
                }
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'premium-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #4f46e5 0deg, #10b981 180deg, #4f46e5 360deg)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
