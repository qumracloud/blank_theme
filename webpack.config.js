const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require("path");

const webpack = require('webpack');


const asset = file => path.resolve('src/assets', file || '');
const public = file => path.resolve("dist", file || '');

module.exports = {
  entry: {
    app: [asset("js/main.js"),asset("styles/style.scss") ],
  },
  output: {
    path: public(),
    clean: true,
    chunkFilename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  regenerator: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: "./src/index.njk",
    // }),
    new MiniCssExtractPlugin({filename: 'style.css'}),
    new CopyPlugin({patterns: [{ from: asset('images'), to: public('images') }],}),
    new webpack.HotModuleReplacementPlugin(), // دعم Hot Module Replacement

  ],
  optimization: {
    minimize: true, // تمكين الضغط
    minimizer: [
      new TerserPlugin(), // لضغط JavaScript
      new CssMinimizerPlugin(), // لضغط CSS
    ],
  },
  mode: 'production',
};