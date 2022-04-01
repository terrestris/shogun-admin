const path = require('path');
const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let devConfig = commonConfig;

devConfig.mode = 'development';

devConfig.output.path = path.resolve(__dirname, 'dist_dev');

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
  webSocketServer: false,
  devMiddleware: {
    writeToDisk: true
  }
};

module.exports = devConfig;
