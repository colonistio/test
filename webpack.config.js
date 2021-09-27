const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./public/js/main.js",
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: "./public/index.html",
      filename: "index.html",
      inject: "body"
    })
  ],
  mode: "development",
  output: {
    clean: true
  },
  devServer: {
    open: true
  }
};
