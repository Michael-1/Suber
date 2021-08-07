const merge = require("webpack-merge");
const baseConfig = require("./webpack.common.js");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: "production",
  plugins: [
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
  ],
});
