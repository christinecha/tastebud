var webpack = require('webpack')

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
        loaders: [ 'babel-loader' ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loaders: [
          'style-loader',
          'css-loader',
          'less-loader'
        ],
        exclude: /node_modules/
      }
    ]
  }
}
