const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let commonWebpackConfig = commonConfig;

commonWebpackConfig.plugins = [
  new HtmlWebpackPlugin({
    favicon: './assets/favicon.ico',
    filename: 'index.html',
    template: './assets/index.html',
    title: 'SHOGun admin -- DEVELOPMENT'
  }),
  ...commonWebpackConfig.plugins || [],
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    APP_MODE: JSON.stringify(commonConfig.TARGET)
  })
];

const proxyCommonConf = {
  changeOrigin: true,
  cookieDomainRewrite: 'localhost',
  cookiePathRewrite: '/',
  secure: false
};

commonWebpackConfig.mode = 'development';
commonWebpackConfig.output.publicPath = 'https://localhost:9090/';
commonWebpackConfig.devtool = 'source-map';

commonWebpackConfig.devServer = {
  historyApiFallback: true,
  host: '0.0.0.0',
  https: true,
  http2: true,
  compress: true,
  magicHtml: false,
  client: {
    logging: 'log'
  },
  port: 9090,
  proxy: [{
    ...proxyCommonConf,
    context: [
      '/auth/**',
      '/users/**',
      '/applications/**',
      '/layers/**',
      '/imagefiles/**',
      '/actuator/**',
      '/cache/**',
      '/sso/**',
      '/config/**',
      '/v2/**'
    ],
    target: 'https://localhost/'
  }, {
    ...proxyCommonConf,
    context: [
      '/info',
      '/users',
      '/graphql',
      '/applications',
      '/layers',
      '/imagefiles',
      '/actuator',
      '/cache',
      '/sso',
      '/v2',
      '/config'
    ],
    target: 'https://localhost/'
  }]
};

module.exports = commonWebpackConfig;
