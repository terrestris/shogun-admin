const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');

let commonWebpackConfig = commonConfig;

commonWebpackConfig.plugins = [
  ...commonWebpackConfig.plugins || [],
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    },
    APP_MODE: JSON.stringify(commonConfig.TARGET)
  })
];

commonWebpackConfig.mode = 'production';

module.exports = commonWebpackConfig;
