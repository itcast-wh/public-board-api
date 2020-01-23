const webpackMerge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.config.base')

const webpackConfig = webpackMerge(baseWebpackConfig, {
  output: {
    filename: '[name].bundle.js'
  },
  devtool: 'eval-source-map',
  mode: 'development',
  stats: { children: false }
})

module.exports = webpackConfig
