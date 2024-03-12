const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";

const plugins = devMode
  ? [
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        linkType: "text/css",
      }),
    ]
  : [];

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                localIdentName: "[local]--[hash:base64:5]",
              },
            },
          },
        ],
      },
      {
        test: /\.(ico|png|jp?g|svg)/,
        type: "asset/resource",
        generator: {
          filename: "img/[name].[hash:8][ext]", // save to file images >= 2 KB
        },
        parser: {
          dataUrlCondition: {
            maxSize: 2 * 1024, // inline images < 2 KB
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    compress: true,
    port: 9000,
    historyApiFallback: true,
  },
  plugins: [
    ...plugins,
    new HtmlWebpackPlugin({
      title: "Summary",
      template: path.resolve(__dirname, "views/index.html"),
    }),
    new CopyPlugin({
      patterns: ["img/icon.png"],
    }),
  ],
  stats: {
    children: true,
  },
};
