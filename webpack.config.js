const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: 'index.js',
    library: '@jcendal/objectid',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    libraryExport: 'default'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
};
