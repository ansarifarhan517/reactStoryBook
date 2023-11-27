const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
var TerserPlugin = require('terser-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: true,
            cache: true,
        })
        ],
        splitChunks: {
            cacheGroups: {
              styles: {
                name: 'styles',
                test: /\.css$/,
                chunks: 'all',
                enforce: true,
              },
            },
        },
    },
    plugins: [
        new ManifestPlugin(),
        new MiniCssExtractPlugin({
          filename: '[name].css',
        }),
    ]    
});