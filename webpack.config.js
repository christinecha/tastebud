const webpack = require('webpack')
const config = require('./config')

module.exports = {
  entry: './src/scripts',
  output: {
    filename: 'dist/bundle.js'
  },
  devServer: {
    historyApiFallback: true,
    contentBase: __dirname + '/',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: [
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loaders: [
          'style-loader',
          'css-loader',
          'less-loader',
          'resolve-url-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|otf)$/,
        loaders: [
          'url-loader?limit=100000'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(config)
  ]
}
