const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

plugins.push(new MiniCssExtractPlugin({ filename: 'index.css' }));

rules.push({
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
});

rules.push({
  test: /\.ttf$/i,
  type: 'asset/resource',
});

rules.push({
  test: /\.(png|svg|jpg|jpeg|gif)$/i,
  use: ['@svgr/webpack'],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
      }),
    ],
  },
};
