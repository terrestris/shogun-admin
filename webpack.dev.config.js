const path = require('path');
const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let devConfig = commonConfig;

devConfig.mode = 'development';

devConfig.plugins = [
  ...commonConfig.plugins || [],
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    APP_MODE: JSON.stringify(commonConfig.TARGET)
  })
];

devConfig.plugins[0] = new HtmlWebpackPlugin({
  favicon: './assets/favicon.ico',
  filename: 'index.html',
  minify: false,
  template: './assets/index.html',
  title: 'SHOGun admin -- DEVELOPMENT'
});

devConfig.devServer = {
  server: 'https',
  compress: true,
  port: 9090,
  historyApiFallback: true,
  allowedHosts: [
    '.intranet.terrestris.de'
  ]
};

module.exports = devConfig;
