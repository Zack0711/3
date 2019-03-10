const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin('style.css');

const optimization = {
  splitChunks: {
    cacheGroups: {
      default: false,
      vendors: {
        name: 'vendor',
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]/,
        chunks: 'all',
      },
    }
  },  
};

const devServer = {
  inline: true,
  https: true,
  open: false,
  host: "0.0.0.0",
  port: 3000,
}

const defaultSetting = {
  page: 'index',
};

module.exports = (env, argv) => {
  const {
    page,
  } = Object.assign(defaultSetting, argv);

  const htmlTemplate = new HtmlWebpackPlugin({
    title: '3D Case editor',
    template: `template/${page}.ejs`,
  })

  const webpackSetting = {
    mode: env === 'dev' ? 'development' : 'production',
    context: `${__dirname}/src/`,
    entry: {
      app: './index.js'
    },
    output: {
      path: `${__dirname}/`,
      filename: 'js/[name].js?[hash]'
    },
    module: {
      rules: [
        {
          test: /\.js(x)?$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: extractSass.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              'sass-loader'
            ]
          })
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          loaders: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]'
              }
            },
            {
              loader: 'image-webpack-loader',
              query: {
                mozjpeg: {
                  progressive: true
                },
                gifsicle: {
                  interlaced: false
                },
                optipng: {
                  optimizationLevel: 4
                },
                pngquant: {
                  quality: '75-90',
                  speed: 3
                }
              }
            }
          ]
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'file-loader?name=public/fonts/[name].[ext]'
        },
        { test: /\.html$/, loader: 'html-loader' }
      ]
    },
    optimization,
    plugins: [
      htmlTemplate,
      extractSass,
    ]
  }

  if( env === 'dev'){
    webpackSetting['devtool'] = 'source-map';
    webpackSetting['devServer'] = devServer;
  }

  return webpackSetting;
};