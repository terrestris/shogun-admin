// please adapt keycloak parameters before start webpack
const keycloakHost = '10.133.9.138';
const keycloakUser = 'shogun';
const keycloakPassword = 'shogun';
const keycloakClientId = 'shogun-app';

const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');
const fetch = require('node-fetch');
const https = require('https');

let commonWebpackConfig = commonConfig;

const headers = {};

const delayedConf = new Promise(function(resolve, reject) {
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
    publicPath: 'https://localhost:9090/',
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
      pathRewrite: { '^/client-config.js': '' },
      context: [
        '/client-config.js',
      ],
      target: 'https://localhost/admin/client-config.js'
    }]
  };
  const loginUrl = `https://${keycloakHost}/auth/realms/SpringBootKeycloak/protocol/openid-connect/token`;
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
  })
    .then(loginResponse => {
      if (!loginResponse.ok) {
        return reject(`Could not login user ${keycloakUser}`);
      }
      return loginResponse.json()
    })
    .then(loginResponseJson => {
      const accessToken = loginResponseJson.access_token;

      headers['Access-Control-Allow-Origin'] = '*';
      headers.Authorization = `Bearer ${accessToken}`;
      headers.Cookie = `token=${accessToken}`;

      return fetch('https://localhost/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: `token=${accessToken}`
        },
        agent
      })
    })
    .then(csrfTokenResponse => {
      if (!csrfTokenResponse.ok) {
        return reject(`Could not get CSRF token`);
      }
      const setCookie = csrfTokenResponse.headers.get('set-cookie');
      const regExp = /XSRF-TOKEN=([\w]+-[\w]+-[\w]+-[\w]+-[\w]+);/g;
      const match = regExp.exec(setCookie);

      if (!match) {
        return reject(`Could not read CSRF token`);
      }

      headers.Cookie = `${headers.Cookie}; X-XSRF-TOKEN=${match[1]};`;

      commonWebpackConfig.devServer.proxy[0].headers = headers;
      commonWebpackConfig.devServer.proxy[1].headers = headers;

      resolve(commonWebpackConfig);
    })
    .catch(error => {
      console.error('Could not start the dev server: ', error)
    });
});

module.exports = new Promise((resolve) => {
  delayedConf
    .then(conf => {
      resolve(conf);
    });
});
