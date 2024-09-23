const path = require('path');

const rspack = require('@rspack/core');

const {
  merge
} = require('webpack-merge');

const common = require('./rspack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    // new rspack.CopyRspackPlugin({
    //   patterns: [
    //     {
    //       from: path.join(__dirname, 'assets'),
    //       to: '.',
    //       globOptions: {
    //         ignore: ['*.html']
    //       },
    //       noErrorOnMissing: true
    //     }
    //   ]
    // }),
    // new rspack.CssExtractRspackPlugin({
    //   filename: 'css/[name].[contenthash].css'
    // })
  ].filter(Boolean),
  output: {
    filename: 'js/[name].[contenthash].js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'node_vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        },
        common: {
          name: 'common',
          test: /[\\/]src[\\/]/,
          chunks: 'all',
          minSize: 0
        }
      }
    },
    moduleIds: 'deterministic',
    runtimeChunk: {
      name: 'manifest'
    }
  }
});
