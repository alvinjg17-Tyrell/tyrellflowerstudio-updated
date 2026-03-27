/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                fontFamily: {
                        'display': ['"Perfectly Vintages"', '"Playfair Display"', 'Georgia', 'serif'],
                        'body': ['"Perfectly Vintages"', 'Georgia', 'serif'],
                        'vintage': ['"Perfectly Vintages"', 'serif'],
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        'tyrell-gold': {
                                DEFAULT: '#f4c952',
                                dark: '#e0b63e',
                                light: '#f9dc7a',
                        },
                        'tyrell-dark': {
                                DEFAULT: '#1a1a1a',
                        },
                        'tyrell-cream': {
                                DEFAULT: '#FFFDF8',
                        },
                        'tyrell-warm': {
                                DEFAULT: '#E8C1B5',
                        },
                        'tyrell-rose': {
                                DEFAULT: '#D8A7B1',
                                light: '#F5F1EB',
                                dark: '#B76E79',
                        },
                        'tyrell-burgundy': {
                                DEFAULT: '#B76E79',
                                light: '#D8A7B1',
                        },
                        'tyrell-sage': {
                                DEFAULT: '#4F6D5E',
                                light: '#F5F1EB',
                                dark: '#3d5549',
                        },
                        'tyrell-nude': {
                                DEFAULT: '#E8C1B5',
                        },
                        'tyrell-ivory': {
                                DEFAULT: '#F5F1EB',
                        },
                        'tyrell-olive': {
                                DEFAULT: '#4F6D5E',
                        },
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};