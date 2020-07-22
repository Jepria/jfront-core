const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
  },
  output: {
    filename: 'index.js',
    libraryTarget: "umd",
    path: path.resolve(__dirname, 'dist'),
  },
};