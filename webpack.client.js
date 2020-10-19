const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: './src/client.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'client-lib.js',
    library: 'client-lib',
    libraryTarget: 'umd',
  },
  externals: [nodeExternals()],
};
