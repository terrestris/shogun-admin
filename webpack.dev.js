const path = require('path');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const {
  merge
} = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    server: 'https',
    port: 9090,
    hot: true,
    static: [
      path.join(__dirname, 'assets')
    ],
    allowedHosts: ['.intranet.terrestris.de']
  },
  plugins: [
    new ReactRefreshWebpackPlugin()
  ]
});
