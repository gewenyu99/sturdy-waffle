const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devServer: {
        compress: true,
        port: 9000
    },
    entry: {
        index: './index.jsx'
    },
    output: {
        path: path.resolve('./build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {test: /\.js$/, loader: 'babel-loader', exclude: '/node_modules/', query: {compact: false}},
            {test: /\.jsx$/, loader: 'babel-loader', exclude: '/node_modules/'}
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./index.html"}),
    ],
};

