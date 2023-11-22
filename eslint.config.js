const nyxb = require('@nyxb/eslint-config').default

module.exports = nyxb({
  rules: {
    'no-console': 0,
    'no-new': 0,
  },
})
