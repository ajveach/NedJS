var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './app/main.js',
  output: { path: path.join(__dirname), filename: 'build.min.js' },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};