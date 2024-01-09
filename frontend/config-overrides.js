const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (config) => {
  config.plugins.push(new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }));
  /**
   * Uncomment to analyze bundle size
   */
  // config.plugins.push(new BundleAnalyzerPlugin({
  //   generateStatsFile: true,
  // }))
  return config;
};
