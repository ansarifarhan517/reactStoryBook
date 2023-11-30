const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js');

const devConfig = {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        port: process.env.PORT || 8080,
        host: '0.0.0.0',
        historyApiFallback: true,
        compress: true,
        hot: true,
        proxy: {
            path: '/api/*',
            target: 'http://localhost:9090'
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'uiLibrary.css',
        })
    ]

}

module.exports = merge(commonConfig, devConfig)
