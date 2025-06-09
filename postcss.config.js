export default {
  plugins: {
    tailwindcss: {
      // Ensure all custom styles are included
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    },
    autoprefixer: {},
    // Prevent CSS purging in production
    ...(process.env.NODE_ENV === 'production' ? {} : {}),
  },
};
