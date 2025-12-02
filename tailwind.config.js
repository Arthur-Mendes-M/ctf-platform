/* eslint-disable @typescript-eslint/no-require-imports */
const scrollbar = require('tailwind-scrollbar');

module.exports = {
  content: [/* ... */],
  theme: { /* ... */ },
  plugins: [
    scrollbar,
    scrollbar({ nocompatible: true }),
  ],
};
