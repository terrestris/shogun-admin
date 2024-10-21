module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-optional-chaining',
    ['@babel/plugin-transform-class-properties', { loose: false }],
    [
      'import',
      {
        'libraryName': 'antd',
        'style': true,
        'libraryDirectory': 'es'
      },
      'import-antd'
    ]
  ]
};
