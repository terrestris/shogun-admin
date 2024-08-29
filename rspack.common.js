// const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');
const rspack = require('@rspack/core');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const CustomAntThemeModifyVars = require('./theme.js');

const deps = require('./package.json').dependencies;

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
    filename: 'js/[name].bundle.js'
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
    },
    alias: {
      'ol': path.join(__dirname, 'node_modules', 'ol'),
    }
  },
  module: {
    rules: [
    //   {
    //   test: /\.m?js$/,
    //   include: /node_modules\/@terrestris/,
    //   resolve: {
    //     fullySpecified: false
    //   }
    // },
    {
      test: /\.m?js/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    },
    {
      test: /\.tsx?|\.jsx?$/,
      use: 'babel-loader',
      exclude: /node_modules\/(?!@terrestris)/
    }, {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
              modifyVars: CustomAntThemeModifyVars
            }
          }
        }
      ]
    }, {
      test: /\.(eot|ttf|svg|woff|woff2)$/i,
      type: 'asset/resource'
    }, {
      test: /\.(jpe?g|png|gif|ico)$/i,
      type: 'asset/resource'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: './assets/favicon.ico',
      filename: 'index.html',
      hash: true,
      minify: 'auto',
      template: './assets/index.html',
      title: 'SHOGun admin'
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
