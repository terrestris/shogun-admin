const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const CustomAntThemeModifyVars = require('./theme.js');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env')
});

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
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.css',
      '.less'
    ],
    alias: {
      // Uncomment if working with npm link
      // ol: path.join(__dirname, 'node_modules', 'ol')
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
          name: 'static/font/[name].[hash:8].[ext]'
        }
      }]
    }, {
      test: /\.(jpe?g|png|gif|ico)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'static/img/[name].[hash:8].[ext]'
        }
      }]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: './assets/favicon.ico',
      filename: 'index.html',
      hash: true,
      minify: {
        collapseWhitespace: true,
        removeComments: true
      },
      template: './assets/index.html',
      title: 'SHOGun admin'
    }),
    new SimpleProgressWebpackPlugin({
      format: 'compact'
    }),
    new webpack.DefinePlugin( {
      'process.env': dotenv.parsed
    })
  ]
};
