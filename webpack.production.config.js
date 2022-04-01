const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');

let productionConfig = commonConfig;

productionConfig.mode = 'production';

productionConfig.plugins = [
  ...commonConfig.plugins || [],
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    },
    APP_MODE: JSON.stringify(commonConfig.TARGET)
  })
];

module.exports = productionConfig;
