const HtmlWebpackPlugin = require("html-webpack-plugin");
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
      {
        test: /\.svg$/,
        exclude: /\/node_modules\//,
        use: {
          loader: "file-loader",
          options: { outputPath: "assets", esModule: false },
        },
      },
    ],
  },
};
