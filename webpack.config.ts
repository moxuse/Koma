import path from 'path';
import { Configuration, ProvidePlugin } from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from "copy-webpack-plugin";

const config: Configuration = {
  mode: 'development',
  target: 'web',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      process: "process/browser",
      util: "util"
    },
    fallback: {
      "assert": require.resolve('assert'),
      "fs": false,
      "util": require.resolve('util'),
      "net": false,
      "path": false,
      "stream": false,
      "constants": require.resolve('constants')
    } 
  },
  entry: {
    app: './src/view/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './', // webpack@5 + electron
    filename: '[name].js',
    assetModuleFilename: 'assets/[name][ext]',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'swc-loader',
      },
      {
        test: /\.css$/,
        use:  ['style-loader', 'css-loader']
      },
      {
        test: /\.(bmp|ico|gif|jpe?g|png|svg|ttf|eot|woff?2?)$/,
        type: 'asset/resource',
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/view/index.html',
      filename: 'index.html',
      scriptLoading: 'module',
      inject: 'body',
      minify: false,
    }),
    new CopyPlugin({
      patterns: [
        { from: "./store.json", to: "./" }
      ],
    }),
    new ProvidePlugin({
      process: 'process/browser',
      util: 'utils'
    }),
  ],
  devtool: 'inline-source-map',
};

export default config;