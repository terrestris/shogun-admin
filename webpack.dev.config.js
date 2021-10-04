// please adapt keycloak parameters before start webpack
const keycloakHost = '<<INSERT_YOUR_KEYCLOAK_IP>>';
const keycloakUser = '<<INSERT_KEYCLOAK_ADMIN_USER>>';
const keycloakPassword = '<<INSERT_KEYCLOAK_ADMIN_PWD>>';
const keycloakClientId = '<<INSERT_KEYCLOAK_CLIENT_ID>>';
const keycloakRealm = '<<INSERT_KEYCLOAK_REALM>>';

const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');
const fetch = require('node-fetch');
const https = require('https');

let commonWebpackConfig = commonConfig;

const headers = {};

const delayedConf = new Promise(function(resolve) {
  commonWebpackConfig.plugins = [
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

  commonWebpackConfig.devServer = {
    historyApiFallback: true,
    contentBase: '.',
    useLocalIp: false,
    disableHostCheck: true,
    host: '0.0.0.0',
    https: true,
    inline: true,
    port: 9090,
    publicPath: 'http://localhost:9090/',
    // https://github.com/chimurai/http-proxy-middleware#context-matching
    // Note: In multiple path matching, you cannot use string paths and
    //       wildcard paths together!
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
        '/v2'
      ],
      target: 'https://localhost/'
    }, {
      ...proxyCommonConf,
      pathRewrite: { '^/shogun-boot/client-config.js': '' },
      context: [
        '/shogun-boot/client-config.js',
      ],
      target: 'https://localhost/admin/client-config.js'
    }]
  };
  const loginUrl = `https://${keycloakHost}/auth/realms/${keycloakRealm}/protocol/openid-connect/token`;
  const body = `username=${keycloakUser}&password=${keycloakPassword}&grant_type=password&` +
    `client_id=${keycloakClientId}`;
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  fetch(loginUrl, {
    method: 'POST',
    body,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    agent
  }).then(response => response.json())
    .then(response => {
      const accessToken = response.access_token;
      headers['Access-Control-Allow-Origin'] = '*';
      headers.Authorization = `Bearer ${accessToken}`;
      headers.Cookie = `token=${accessToken}`;
      commonWebpackConfig.devServer.proxy[0].headers = headers;
      commonWebpackConfig.devServer.proxy[1].headers = headers;

      resolve(commonWebpackConfig);
    });

});

module.exports = new Promise((resolve) => {
  delayedConf.then((conf) => {
    resolve(conf);
  });
});
