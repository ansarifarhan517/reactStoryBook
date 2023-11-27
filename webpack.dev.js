const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
    mode: 'development',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'uiLibrary.css',
        })
    ]
});