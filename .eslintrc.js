module.exports = {
  'env': {
    'browser': true,
    'node': true
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'tsconfigRootDir': __dirname,
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint',
    '@typescript-eslint/eslint-plugin' // right
  ],
  'rules': {
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        'selector': 'variable',
        'format': ['camelCase', 'UPPER_CASE', 'PascalCase']
      },
      {
        'selector': 'interface',
        'format': ['PascalCase'],
        'custom': {
          'regex': '^I[A-Z]',
          'match': false
        }
      }
    ],
    '@typescript-eslint/indent': [
      'warn',
      2,
      {
        'FunctionDeclaration': {
          'parameters': 'first'
        },
        'FunctionExpression': {
          'parameters': 'first'
        },
        'SwitchCase': 1
      }
    ],
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        'multiline': {
          'delimiter': 'semi',
          'requireLast': true
        },
        'singleline': {
          'delimiter': 'semi',
          'requireLast': false
        }
      }
    ],
    '@typescript-eslint/member-ordering': 'warn',
    '@typescript-eslint/quotes': [
      'warn',
      'single'
    ],
    '@typescript-eslint/semi': [
      'warn',
      'always'
    ],
    '@typescript-eslint/type-annotation-spacing': 'warn',
    'camelcase': 'warn',
    'comma-dangle': 'warn',
    'curly': 'warn',
    'default-case': 'warn',
    'dot-notation': 'warn',
    'eol-last': 'warn',
    'eqeqeq': [
      'warn',
      'smart'
    ],
    'guard-for-in': 'warn',
    'id-blacklist': [
      'warn',
      'any',
      'Number',
      'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined'
    ],
    'id-match': 'warn',
    'max-len': [
      'warn',
      {
        'code': 120
      }
    ],
    'no-bitwise': 'warn',
    'no-caller': 'warn',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-empty': 'warn',
    'no-eval': 'warn',
    'no-fallthrough': 'warn',
    'no-multiple-empty-lines': 'warn',
    'no-new-wrappers': 'warn',
    'no-redeclare': 'warn',
    'no-shadow': [
      'warn',
      {
        'hoist': 'all'
      }
    ],
    'no-trailing-spaces': 'warn',
    'no-underscore-dangle': [
      'error',
      {
        'allowAfterThis': true
      }
    ],
    'no-unused-expressions': 'warn',
    'no-unused-labels': 'warn',
    'radix': 'warn',
    'spaced-comment': 'warn'
  }
};
