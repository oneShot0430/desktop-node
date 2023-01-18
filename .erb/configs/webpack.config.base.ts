/**
 * Base webpack config used across other specific configs
 */
import path from 'path';
import webpack from 'webpack';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    // There is no need to add aliases here, the paths in tsconfig get mirrored
    // plugins: [new TsconfigPathsPlugins({ configFile: './tsconfig.json' })],
    plugins: [new TsconfigPathsPlugins()],
    // alias: {
    //   config: path.resolve(__dirname, '../../src/config/'),
    //   main: path.resolve(__dirname, '../../src/main/'),
    //   services: path.resolve(__dirname, '../../src/services/'),
    //   utils: path.resolve(__dirname, '../../src/utils/'),
    //   models: path.resolve(__dirname, '../../src/models/'),
    // },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

export default configuration;
