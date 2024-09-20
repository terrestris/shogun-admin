// const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');
const path = require('path');

const rspack = require('@rspack/core');

const deps = require('./package.json').dependencies;

const CustomAntThemeModifyVars = require('./theme.js');

module.exports = {
  entry: [
    './src/index.tsx'
  ],
  externals: {
    shogunApplicationConfig: 'shogunApplicationConfig'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.css',
      '.less'
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
      test: /\.less$/,
      type: 'css/auto',
      use: [{
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: CustomAntThemeModifyVars
          }
        }
      }]
    }, {
      test: /\.d\.ts$/,
      loader: 'ignore-loader'
    }, {
      test: /\.(jpe?g|png|gif|ico|pdf|eot|svg|ttf|woff(2)?)$/,
      type: 'asset/resource'
    }]
  },
  experiments: {
    css: true
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'assets', 'index.html'),
      templateParameters: {
        title: 'SHOGun Admin',
        appPrefix: process.env.HTML_BASE_URL ?? ''
      },
      favicon: path.join(__dirname, 'assets', 'favicon.ico'),
      meta: {
        viewport: 'user-scalable=no, width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    }),
    new rspack.CopyRspackPlugin({
      patterns: [{
        from: './assets/formconfigs/',
        to: 'formconfigs'
      }, {
        from: './assets/img/',
        to: 'img'
      }, {
        from: './assets/fallbackConfig.js',
        to: 'fallbackConfig.js'
      }, {
        from: './node_modules/monaco-editor/min/vs',
        to: 'vs'
      }]
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
    new rspack.container.ModuleFederationPlugin({
      name: 'SHOGunAdmin',
      // remotes: {
      //   'ExamplePlugin': 'ExamplePlugin@https://localhost/admin-plugins/index.js'
      // },
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: deps.react
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: deps['react-dom']
        },
        'react-i18next': {
          singleton: true,
          eager: true,
          requiredVersion: deps['react-i18next']
        },
        'ol': {
          singleton: true,
          eager: true,
          requiredVersion: deps.ol
        },
        'ol/': {
          singleton: true,
          eager: true,
          requiredVersion: deps.ol
        },
        'ol-mapbox-style': {
          singleton: true,
          eager: true,
          requiredVersion: deps['ol-mapbox-style']
        },
      }
    })
  ]
};
