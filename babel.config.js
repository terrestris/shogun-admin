module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/proposal-optional-chaining',
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
