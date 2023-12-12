var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    // devtool: 'inline-source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'uiLibrary.css',
        })
        // ,
        // new HtmlWebpackPlugin({
        //   template: './loginDev.html',
        //   filename: './login.html',
        //   chunks: ['loginvendor.min.cache', 'loginapp.full.min']
        // }),
        // new HtmlWebpackPlugin({
        //   template: './indexDev.html',
        //   filename: './index.html',
        //   chunks: ['vendor.min.cache', 'app.full.min']
        // })
    ]
});