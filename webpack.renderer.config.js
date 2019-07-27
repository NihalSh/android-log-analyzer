const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const rules = require('./webpack.rules');

const devMode = process.env.NODE_ENV !== 'production';
const srcPath = path.join(__dirname, 'src');

rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  include: srcPath,
  loader: 'babel-loader',
});

rules.push({
  test: /\.css$/,
  use: [
    { loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader },
    {
      loader: 'css-loader',
      options: {
        modules: {
          mode: 'local',
          localIdentName: '[path][name]__[local]--[hash:base64:5]',
          context: path.resolve(__dirname, 'src'),
        }
      },
    },
  ],
});



module.exports = {
  // Put your normal webpack config below here
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
    alias: {
      components: `${srcPath}/components/`,
      containers: `${srcPath}/containers/`,
      ducks: `${srcPath}/state/ducks/`,
      lib: `${srcPath}/lib`,
      models: `${srcPath}/models`,
    },
  },
  module: {
    rules,
  },
};
