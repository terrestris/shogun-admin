const path = require('path');

const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');
const rspack = require('@rspack/core');

const config = require('./package.json');

const deps = config.dependencies;

module.exports = {
  entry: [
    'whatwg-fetch',
    '@babel/polyfill',
    './src/index.tsx'
  ],
  externals: {
    shogunApplicationConfig: 'shogunApplicationConfig'
  },
  output: {
    appPrefix: '/admin/',
    filename: 'js/[name].bundle.js',
    publicPath: 'auto',
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.cjs',
      '.mjs'
    ],
    fallback: {
      buffer: require.resolve('buffer/')
    }
  },
  module: {
    rules: [{
      test: /\.m?js/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    }, {
      test: /\.(j|t)s$/,
      exclude: [/[\\/]node_modules[\\/]/],
      loader: 'builtin:swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'typescript'
          },
          externalHelpers: true
        },
        env: {
          targets: 'Chrome >= 48'
        }
      }
    }, {
      test: /\.tsx$/,
      loader: 'builtin:swc-loader',
      exclude: [/[\\/]node_modules[\\/]/],
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true
          },
          transform: {
            react: {
              runtime: 'automatic'
            }
          },
          externalHelpers: true
        },
        env: {
          targets: 'Chrome >= 48'
        }
      }
    }, {
      test: /\.d\.ts$/,
      loader: 'ignore-loader'
    }, {
      test: /\.(eot|ttf|svg|woff|woff2)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'static/font/[name].[contenthash:8].[ext]'
        }
      }]
    }, {
      test: /\.(jpe?g|png|gif|ico)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'static/img/[name].[contenthash:8].[ext]'
        }
      }]
    }]
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      filename: 'index.html',
      title: 'SHOGun Admin',
      template: path.join(__dirname, 'resources', 'template', 'index.ejs'),
      templateParameters: {
        appPrefix: process.env.HTML_BASE_URL ?? ''
      },
      favicon: path.join(__dirname, 'resources', 'public', 'favicon.ico'),
      minify: true,
      meta: {
        charset: 'utf-8',
        viewport: 'user-scalable=no, width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    }),
    new rspack.CopyRspackPlugin({
      patterns: [{
        from: path.join(__dirname, 'resources', 'formconfigs'),
        to: 'formconfigs'
      }, {
        from: path.join(__dirname, 'resources', 'public', 'img'),
        to: 'img'
      }, {
        from: path.join(__dirname, 'resources', 'public', 'fallbackConfig.js'),
        to: 'fallbackConfig.js'
      }, {
        from: path.join(__dirname, 'node_modules', 'monaco-editor', 'min', 'vs'),
        to: 'vs'
      }],
    }),
    new rspack.DefinePlugin({
      PROJECT_VERSION: JSON.stringify(require('./package.json').version),
    }),
    new rspack.ProvidePlugin({
      Buffer: [
        'buffer',
        'Buffer'
      ]
    }),
    new ModuleFederationPlugin({
      name: 'SHOGunAdmin',
      dev: {
        disableDynamicRemoteTypeHints: true
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom']
        },
        'react-redux': {
          singleton: true,
          requiredVersion: deps['react-redux']
        },
        '@terrestris/react-geo/': {
          singleton: true,
          requiredVersion: deps['@terrestris/react-geo']
        },
        'react-i18next': {
          singleton: true,
          requiredVersion: deps['react-i18next']
        }
      }
    })
  ]
};
