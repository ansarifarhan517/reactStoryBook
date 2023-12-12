const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const Visualizer = require('webpack-visualizer-plugin');

module.exports = {
    target: 'web',
    entry: "./src/index.tsx",
    // mode: "development",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.umd.js',
        library: "ui-library",
        libraryTarget: 'umd',
        // publicPath: '/',
        // globalObject: 'this'
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
                query: {
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
                query: {
                    outputPath: 'images/',
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(mp3|wav)$/,
                loader: 'file-loader',
                query: {
                    outputPath: 'sounds/',
                    name: '[name].[ext]'
                }
            }
            // {
            //     test: /\.(otf|ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            //     loader: 'file-loader',
            //     query: {
            //         outputPath: 'fonts/',
            //         name: '[name].[ext]'
            //     }
            // }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
        // alias: {
        //     $: path.resolve(__dirname, './common/jquery/jquery.min.js'),
        //     jquery: path.resolve(__dirname, './common/jquery/jquery.min.js'),
        //     jQuery: path.resolve(__dirname, './common/jquery/jquery.min.js'),
        //     jQ: path.resolve(__dirname, './common/jquery/jquery.min.js'),
        //     d3: path.resolve(__dirname, './common/d3/d3.js'),
        //     nvd3: path.resolve(__dirname, './common/nvd3/nv.d3.js'),
        //     'jquery-ui': path.resolve(__dirname, './common/jquery-ui.min.js'),
        //     three: path.resolve(__dirname, './common/Threejs/three.min.js')
        // }
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         _: 'underscore',
    //         'window._': 'underscore',
    //         moment: 'moment-timezone',
    //         'window.moment': 'moment-timezone',
    //         bootbox: 'bootbox',
    //         'window.bootbox': 'bootbox',
    //         turf: path.resolve(path.join(__dirname, 'common/leaflet/turf.min.js')),
    //         tzlookup: 'tz-lookup',
    //         vis: 'vis',
    //         lunr: path.resolve(
    //             path.join(__dirname, 'devPortal/javascripts/lunr.min.js')
    //         ),
    //         simpleheat: path.resolve(
    //             __dirname,
    //             './common/logi-map/v2/plugins/simpleheat/simpleHeat.js'
    //         ),
    //         THREE: 'three'
    //     }),
    //     new ngAnnotatePlugin({
    //         add: true
    //     }),
    //     new CopyPlugin({
    //         patterns: [
    //             { from: 'font-icons', to: 'font-icons' },
    //             { from: 'images', to: 'images' },
    //             { from: 'json', to: 'json' },
    //             { from: 'fonts', to: 'fonts' },
    //             { from: 'fonts', to: 'font' },
    //             { from: 'src/assets/ui-library-icons/fonts', to: 'ui-library-fonts' },
    //             { from: 'devPortal', to: 'devPortal' }
    //         ]
    //     }),
    //     new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })
    //     // new BundleAnalyzerPlugin({
    //     //     analyzerMode: 'static',
    //     //     reportFilename: './report.html',
    //     //     openAnalyzer: false
    //     // }),
    //     // new Visualizer()
    // ]
    externals: {
        'react-dom': {
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            root: 'ReactDOM'
        },
        'styled-components': "styled-components",
        // leaflet: {
        //     commonjs: 'leaflet',
        //     commonjs2: 'leaflet',
        //     root: 'L'
        // },
        // 'react-leaflet': {
        //     commonjs: 'react-leaflet',
        //     commonjs2: 'react-leaflet',
        //     root: 'ReactLeaflet'
        // },
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            root: 'React'
        }
    }
}
