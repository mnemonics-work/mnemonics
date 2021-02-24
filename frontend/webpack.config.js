const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );
const webpack = require('webpack');
require('dotenv').config( {
    path: path.join(__dirname, '.env')
} );

const config = {
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
            {test: /\.tsx?$/, exclude: /node_modules/, loader: "babel-loader"},
            {test: /\.tsx?$/, exclude: /node_modules/, loader: "ts-loader"},
            {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
        ],
    },
    plugins :[
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'MNEMONICS_BASE_URL': JSON.stringify(process.env.MNEMONICS_BASE_URL),
                'PORT': JSON.stringify(process.env.PORT),
            }
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
}

module.exports = (env, argv) => {
    if(argv.mode === 'production'){
        config.devtool = false;
    }
    return config;
}