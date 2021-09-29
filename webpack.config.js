const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: path.resolve(__dirname, "src", "index.html"),
      filename: "index.html",
      inject: "body"
    }),
    new CopyPlugin({
      patterns: [
        path.resolve(__dirname, "src", "wall.png"),
        path.resolve(__dirname, "src", "ball.png"),
      ],
    }),
  ],
  module: {
    rules: [{
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    }]
  },
  mode: "development",
  output: {
    clean: true
  },
  devServer: {
    open: true
  }
};
