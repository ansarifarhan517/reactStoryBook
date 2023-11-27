const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: './index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.umd.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            }
        ]
    },
    resolve: {
        extension: ['*', '.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    external: {
        'react-dom': {
            commonjs: 'react-dom',
            root: 'ReactDOM'
        },
        'styled-components': "styled-components",
        react: {
            commonjs: 'react',
            root: 'React'
        }
    }
}