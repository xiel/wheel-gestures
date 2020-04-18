module.exports = {
  extends: ['react-app', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  plugins: ['simple-import-sort'],
  rules: {
    'react/self-closing-comp': ['error', { component: true, html: true }],
    'react/jsx-boolean-value': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    'simple-import-sort/sort': 'error',
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
  },
  settings: {
    react: {
      version: '999.999.999',
    },
  },
}
