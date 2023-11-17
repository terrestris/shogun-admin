module.exports = {
  extends: '@terrestris/eslint-config-typescript-react',
  plugins: ['simple-import-sort'],
  rules: {
    'dot-notation': 'off',
    '@typescript-eslint/member-ordering': 'off',
    'object-property-newline': 'error',
    'object-curly-newline': 'error',
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': 'warn'
  }
};
