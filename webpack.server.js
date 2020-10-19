const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: './src/server.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'template/server/rooms'),
    filename: 'server-lib.js',
    library: 'server-lib',
    libraryTarget: 'umd',
  },
  externals: [nodeExternals()],
};
