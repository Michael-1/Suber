const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
  },
  devServer: {
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
      },
    },
    host: "0.0.0.0",
  },
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      meta: { viewport: "width=device-width" },
      title: "Suber",
    }),
    new FaviconsWebpackPlugin({
      logo: "./logo.svg",
      devMode: "webapp",
      favicons: {
        appName: "Suber",
        appleStatusBarStyle: "default"
        icons: {
          coast: false,
          firefox: false,
          yandex: false,
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.s?css$/,
        exclude: /\/node_modules\//,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
