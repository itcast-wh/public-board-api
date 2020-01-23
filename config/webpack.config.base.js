const path = require('path')

const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const DEV_MODE = !(
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
)

const resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}

const APP_PATH = resolve('src')
const DIST_PATH = resolve('dist')

const webpackConfig = {
  target: 'node',
  entry: {
    server: path.join(APP_PATH, 'index.js')
  },
  resolve: {
    modules: [APP_PATH, 'node_modules'],
    extensions: ['.js', '.json'],
    alias: {
      '@': APP_PATH
    }
  },
  output: {
    path: DIST_PATH
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: [resolve('./node_modules'), DIST_PATH],
        include: APP_PATH
      }
    ]
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        DEV_MODE: DEV_MODE,
        NODE_ENV:
          process.env.NODE_ENV === 'production' ||
            process.env.NODE_ENV === 'prod'
            ? '\'production\''
            : '\'development\''
      }
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
    path: true
  }
}

module.exports = webpackConfig
