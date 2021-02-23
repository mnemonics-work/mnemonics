const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );
const webpack = require('webpack');
require('dotenv').config( {
    path: path.join(__dirname, '.env')
} );

module.exports = {
    mode: 'development',
    watch: true,
    entry: {
        app: path.join(__dirname, 'src', 'index.tsx')
    },
    target: 'web',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true
    },
    module: {
        rules: [
            {test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"]},
            {test: /\.css$/, use: ["style-loader", "css-loader"]},
            {test: /\.tsx?$/, loader: "babel-loader"},
            {test: /\.tsx?$/, loader: "ts-loader"},
            {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
        ],
    },
    plugins :[
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'MNEMONICS_BASE_URL': JSON.stringify(process.env.MNEMONICS_BASE_URL)
            }
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
}