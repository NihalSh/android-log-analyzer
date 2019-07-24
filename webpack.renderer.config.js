const path = require('path');
const rules = require('./webpack.rules');

const srcPath = path.join(__dirname, 'src');

rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  include: srcPath,
  loader: 'babel-loader',
});

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});



module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
