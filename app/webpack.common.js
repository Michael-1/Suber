const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      inject: "body",
      title: "Suber",
      meta: { viewport: "width=device-width" },
      template: "./src/index.html",
    }),
    new FaviconsWebpackPlugin({
      logo: "./sponge.svg",
      favicons: {
        appName: "Suber",
        appleStatusBarStyle: "default",
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
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        use: "babel-loader",
      },
      {
        test: /\.s?css$/,
        exclude: /\/node_modules\//,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.html$/,
        exclude: /\/node_modules\//,
        use: "html-loader",
      },
    ],
  },
};
