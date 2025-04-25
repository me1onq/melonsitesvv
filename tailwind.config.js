module.exports = {
    content: ["./app/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          // Добавляем только если нужны особые оттенки
          'light-blue': '#93c5fd', // Пример кастомного голубого
          'deep-emerald': '#047857' // Пример кастомного зелёного
        }
      },
    },
    plugins: [],
  }