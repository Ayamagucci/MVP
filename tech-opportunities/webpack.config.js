require('dotenv').config();
const { MODE, PORT, API_URL, API_ID, API_KEY } = process.env;
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = {
  mode: MODE,
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: [ '.js', '.jsx' ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env', '@babel/preset-react' ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
      filename: 'index.html'
    }),
    // defines global constants that can be used during build process
    new DefinePlugin({
      'process.env': {
        PORT: JSON.stringify(PORT),
        // API_URL: JSON.stringify(API_URL),
        API_ID: JSON.stringify(API_ID),
        API_KEY: JSON.stringify(API_KEY),
      }
    })
  ]
};