const rspack = require('@rspack/core');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {
  merge
} = require('webpack-merge');

const common = require('./rspack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    process.env.BUNDLE_ANALYZE && new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin(),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: 'assets',
          filter: (filepath) => !filepath.endsWith('.html'),
          noErrorOnMissing: true
        }
      ]
    }),
    new rspack.CssExtractRspackPlugin({
      filename: '[name].[contenthash].css'
    })
  ].filter(Boolean),
  output: {
    filename: '[name].[contenthash].js'
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
    },
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ]
  }
});
