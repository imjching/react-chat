const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'chat-frontend'),
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'js/app.bundle.js',
    publicPath: '/assets/'
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 9000,
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
