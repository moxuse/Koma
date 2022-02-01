import path from 'path';
import { Configuration, ProvidePlugin, DefinePlugin } from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from "copy-webpack-plugin";

const environment = process.env.NODE_ENV || 'development';
console.log('build with:', environment);

const mainConfig = {
  mode: 'development',
  target: 'electron-main',
  entry: {
    main: './src/main/index.ts',
    preload: './src/main/preload.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: '[name].js',
  },
  externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
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
  module: {
    rules: [  
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'swc-loader',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: 'swc-loader'
      },
      {
        test: /\.node$/,
        use: 'node-loader',
        exclude: '/Debug/iconv.node',
      },
    ]
  }
};


const rendererConfig: Configuration = {
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
    app: './src/renderer/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './', // webpack@5 + electron
    filename: '[name].js',
    assetModuleFilename: 'media/[name][ext]',
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
      template: './src/renderer/index.html',
      filename: 'index.html',
      scriptLoading: 'module',
      inject: 'body',
      minify: false,
    }),
    new CopyPlugin({
      patterns: [
        { from: "./media", to: "./" },
      ],
    }),
    new ProvidePlugin({
      process: 'process/browser',
      util: 'utils'
    }),
    new DefinePlugin({
      ENV: JSON.stringify(environment)
    })
  ],
  devtool: 'inline-source-map',
};

const exportModules = (environment === 'production') ? [mainConfig, rendererConfig] : rendererConfig;

export default exportModules;