const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';

const srcPath = path.join(__dirname, '../src');

module.exports = {
  context: srcPath,
  resolve: {
    alias: {
      constants: `${srcPath}/constants/`,
      components: `${srcPath}/components/`,
      containers: `${srcPath}/containers/`,
      ducks: `${srcPath}/state/ducks/`,
      lib: `${srcPath}/lib`,
      models: `${srcPath}/models`,
    },
  },
  module: {
    rules: [
      {
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
      },
    ],
  },
};

