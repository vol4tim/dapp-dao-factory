var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  devtool: 'source-map',

  entry: [
    'webpack-hot-middleware/client',
    'babel-polyfill',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('bundle.css')/*,
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
  })*/
  ],
  module: {
      preLoaders: [
        {
          test: /\.js$/,
          loaders: ['eslint'],
          include: [
            path.resolve(__dirname, 'src')
          ]
        }
      ],
      loaders: [
        {
          test: /\.css/,
          loader: ExtractTextPlugin.extract(
              'style-loader',
              'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]'
          )
        },
        {
          loaders: ['react-hot', 'babel-loader'],
          include: [
            path.resolve(__dirname, 'src')
          ],
          test: /\.js$/,
          plugins: ['transform-runtime']
        }
      ]
  }
}
