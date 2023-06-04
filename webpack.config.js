const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  optimization: {
    minimize: false
  },
  performance: {
    hints: false
  }
};
