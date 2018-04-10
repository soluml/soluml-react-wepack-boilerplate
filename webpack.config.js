const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDebug = !process.argv.includes('-p');

module.exports = env => ({
  mode: isDebug ? 'development' : 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: ['node_modules']
  },
  target: 'web',
  entry: {
    app: ['./src/client/css/index.scss', './src/client/js/index']
  },
  output: {
    path: path.resolve('./www'),
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            }
          }
        ]
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              mergeRules: false,
              minimize: false,
              import: false
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: false,
              sourceMapContents: false
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/main/img/sprite'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: '[name]',
              extract: true,
              spriteFilename: 'sprite.svg'
            }
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [{ convertPathData: false }]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Boilerplate',
      template: './src/client/html/index.html',
      inject: false,
      minify: isDebug ? false : { collapseWhitespace: true }
    }),
    new MiniCssExtractPlugin({ filename: '[name].css', chunkFilename: '[id].css' }),
    new SpriteLoaderPlugin(),
    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        ecma: 8,
        mangle: true,
        compress: { drop_console: true },
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ].concat(isDebug
    ? []
    : [new BundleAnalyzerPlugin({ analyzerMode: 'static' })]),
  devServer: {
    contentBase: [path.join(__dirname, 'www')],
    compress: true,
    open: true,
    hot: true,
    historyApiFallback: true
  },
  node: {
    __dirname: true
  }
});
