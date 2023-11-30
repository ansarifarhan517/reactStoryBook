const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path');

module.exports = {
    target: "web",
    entry: "src/index.tsx",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.umd.js',
        library: "ui-library",
        libraryTarget: 'umd',
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
            },
            {
                test: /\.html$/,
                exclude: /dist/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    { loader: "style-loader" },
                    // { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    // { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(png|jpg|gif|ico|webp)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'images/',
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'],
            },
            {
                test: /\.(mp4)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'images/',
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(mp3|wav)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'sounds/',
                    name: '[name].[ext]'
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
    externals: {
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