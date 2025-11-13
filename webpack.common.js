// webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true
  },

  module: {
    rules: [
      // CSS
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      // HTML
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
