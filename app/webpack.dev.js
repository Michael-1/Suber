const merge = require("webpack-merge");
const baseConfig = require("./webpack.common.js");

module.exports = merge(baseConfig, {
  mode: "development",
  devServer: {
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
    host: "0.0.0.0",
  },
  devtool: "source-map",
});
