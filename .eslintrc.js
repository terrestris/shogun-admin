module.exports = {
  extends: '@terrestris/eslint-config-typescript-react',
  plugins: ['import'],
  rules: {
    'dot-notation': 'off',
    '@typescript-eslint/member-ordering': 'off',
    'object-property-newline': 'error',
    'object-curly-newline': 'error',
    'import/no-unresolved': 'off',
    'import/named': 'off',
    'import/order': ['warn', {
      'groups': [
        'builtin',
        'external',
        'parent',
        'sibling',
        'index',
        'object'
      ],
      'pathGroups': [{
        'pattern': 'react',
        'group': 'external',
        'position': 'before'
      }, {
        'pattern': '@terrestris/**',
        'group': 'external',
        'position': 'after'
      }],
      'pathGroupsExcludedImportTypes': ['react'],
      'newlines-between': 'always-and-inside-groups',
      'alphabetize': {
        'order': 'asc',
        'caseInsensitive': true
      }
    }]
  }
};
