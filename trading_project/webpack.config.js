const path = require('path');

module.exports = {
  // entry: './assets/index.js',  // path to our input file
  entry: './assets/javascript/index.js',
  output: {
    // filename: 'index-bundle.js',  // output bundle file name
    filename: 'bundle.js',
    // path: path.resolve(__dirname, './static'),  // path to our Django static directory
    path: path.resolve(__dirname, './static/js'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        // loader: "babel-loader",
        // options: { presets: ["@babel/preset-env", "@babel/preset-react"] }
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};