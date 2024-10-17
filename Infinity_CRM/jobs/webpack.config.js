const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  
  output: {
    path: path.resolve(__dirname, "./static/jobs"),
    filename: "[name].js",
  },
  
  module: {
    rules: [
      {
        test: /\.js|.jsx$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
     {
            test: /\.(css|sass|scss)$/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader'
              },
              {
                loader: 'sass-loader'
              }]
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "React": "react",
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
  ],
};