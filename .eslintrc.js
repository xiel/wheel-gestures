module.exports = {
  extends: ['react-app', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  rules: {
    'react/self-closing-comp': ['error', { component: true, html: true }],
    'react/jsx-boolean-value': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'error',
  },
  settings: {
    react: {
      version: '999.999.999',
    },
  },
}
