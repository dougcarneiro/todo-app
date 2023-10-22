module.exports = {
  darkMode: 'class',
  content: ['./**/*.{html,js}', 'node_modules/preline/dist/*.js'],
  theme: {
    extend: {},
    fontFamily: {
      'montserrat': ['Montserrat'],
      'amatic': ['Amatic SC'],
      'satisfy': ['Satisfy'],

    },
  },
  plugins: [require('preline/plugin')],
};
