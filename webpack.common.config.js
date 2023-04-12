const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const CustomAntThemeModifyVars = require('./theme.js');

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
    }
  },
  module: {
    rules: [{
      test: /\.tsx?|\.jsx?$/,
      use: 'babel-loader',
      exclude: /node_modules\/(?!@terrestris)/
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
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
    new HtmlWebpackPlugin({
      favicon: './assets/favicon.ico',
      filename: 'index.html',
      hash: true,
      minify: 'auto',
      template: './assets/index.html',
      title: 'SHOGun admin'
    }),
    new CopyPlugin({
      patterns: [{
        from: './assets/formconfigs/',
        to: 'formconfigs'
      }, {
        from: './assets/img/',
        to: 'img'
      }, {
        from: './assets/fallbackConfig.js',
        to: 'fallbackConfig.js'
      },{
        from: './node_modules/monaco-editor/min/vs',
        to: 'vs'
      }],
    }),
    new webpack.DefinePlugin({
      PROJECT_VERSION: JSON.stringify(require('./package.json').version),
    }),
    new webpack.ProvidePlugin({
      Buffer: [
        'buffer',
        'Buffer'
      ]
    })
  ]
};
