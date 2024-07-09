const path = require('path');

const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const { merge } = require('webpack-merge');

const common = require('./rspack.common.js');

const CustomAntThemeModifyVars = require('./theme.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    server: 'http',
    port: 8080,
    client: {
      webSocketURL: 'http://0.0.0.0:0/admin/ws'
    },
    hot: true,
    static: path.join(__dirname, 'resources', 'public'),
    historyApiFallback: true
  },
  module: {
    rules: [{
      test: /\.less$/,
      type: 'css',
      use: [{
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: CustomAntThemeModifyVars
          }
        }
      }]
    }]
  },
  plugins: [
    new ReactRefreshPlugin()
  ]
});
