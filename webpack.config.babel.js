import webpack from 'webpack';
import path from 'path';

const { NODE_ENV } = process.env;

const plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
];

const filename = `summon${NODE_ENV === 'production' ? '.min' : ''}.js`;

NODE_ENV === 'production' && plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      pure_getters: false,
      unsafe: false,
      unsafe_comps: false,
      screw_ie8: true,
      warnings: false,
    },
  })
);

export default {
  node: {
    fs: 'empty',
    utils: 'empty',
    http: 'empty',
  },

  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
    ],
  },

  entry: [
    './src/phetch',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'phetch',
    libraryTarget: 'umd',
  },

  plugins,
};
