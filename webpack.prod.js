// var HtmlWebpackPlugin = require('html-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    // devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            // Use multi-process parallel running to improve the build speed
            // Default number of concurrent runs: os.cpus().length - 1
            parallel: true,
            // Enable file caching
            cache: true,
            // sourceMap: true,
        }),

            // new OptimizeCssAssetsPlugin({
            //   cssProcessorOptions: {
            //     map: {
            //       inline: false,
            //       annotation: true,
            //     },
            //   },
            //   cssProcessorPluginOptions: {
            //     preset: ['default', { discardComments: { removeAll: true } }],
            //   }
            // })
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



        // ,
        // new HtmlWebpackPlugin({
        //   template: './loginProd.html',
        //   filename: './login.html',
        //   chunks: []
        // }),
        // new HtmlWebpackPlugin({
        //   template: './indexProd.html',
        //   filename: './index.html',
        //   chunks: []
        // })
    ]
});