const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/Button.jsx',
  cache: false,

  mode: 'development',
  devtool: 'source-map',

  optimization: {
    minimize: false,
    runtimeChunk: false,
  },

  output: {
    publicPath: 'auto',
    uniqueName: 'demo_remote',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.mjs'],
  },
  devServer: {
    port: 3003,
    hot: !isProd,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        options: {
          presets: [require.resolve('@babel/preset-react')],
          plugins: [!isProd && require.resolve('react-refresh/babel')].filter(
            Boolean
          ),
        },
      },
    ],
  },

  plugins: [
    new ReactRefreshWebpackPlugin(),
    new ModuleFederationPlugin({
      name: 'demo_remote',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button',
      },
      shared: {
        'react-dom': {
          singleton: true,
        },
        react: {
          singleton: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ].filter(Boolean),
};
