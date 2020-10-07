const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');
let commonWebpackConfig = commonConfig;

const delayedConf = new Promise(function(resolve) {
  commonWebpackConfig.plugins = [
    ...commonWebpackConfig.plugins || [],
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin({ profile: false }),
    new webpack.DefinePlugin({
      APP_MODE: JSON.stringify(commonConfig.TARGET)
    })
  ];

  const proxyCommonConf = {
    changeOrigin: false,
    cookieDomainRewrite: 'localhost',
    cookiePathRewrite: '/',
    secure: true
  };

  commonWebpackConfig.devServer = {
    historyApiFallback: true,
    contentBase: '.',
    useLocalIp: false,
    disableHostCheck: true,
    host: '0.0.0.0',
    https: false,
    inline: true,
    port: 9090,
    publicPath: 'http://localhost:9090/',
    // https://github.com/chimurai/http-proxy-middleware#context-matching
    // Note: In multiple path matching, you cannot use string paths and
    //       wildcard paths together!
    proxy: [{
      ...proxyCommonConf,
      context: [
        '/shogun-boot/**',
        '/auth/**',
        '/users/**',
        '/sso/**'
      ],
      target: 'http://localhost:8080/'
    }, {
      ...proxyCommonConf,
      context: [
        '/info',
        '/users',
        '/graphql',
        '/sso'
      ],
      target: 'http://localhost:8080/'
    }]
  };

  resolve(commonWebpackConfig);
});

module.exports = new Promise((resolve) => {
  delayedConf.then((conf) => {
    resolve(conf);
  });
});
