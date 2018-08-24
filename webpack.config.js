const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
      entry: './src/index.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: "/"
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader'
          },
          {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader'],
            }),
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx']
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: './public/index.html'
        }),
        new ExtractTextPlugin("styles.css"),
      ],
      mode: webpack.isLocal ? "development" : "production",
      optimization: {
        minimize: false,
      }
    }
;
module.exports = config;
