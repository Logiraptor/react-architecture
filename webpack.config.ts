import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import {Configuration} from 'webpack'

const config: Configuration = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        path: __dirname + '/dist',
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                enforce: 'pre',
                exclude: [
                    /node_modules/,
                ],
            },
            {test: /\.(tsx|ts)$/, loader: 'awesome-typescript-loader'},
            {
                test: /\.(scss)$/, use:
                    ExtractTextPlugin.extract({
                        use: ['css-loader', 'resolve-url-loader', 'sass-loader'],
                    }),
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
        }),
        new ExtractTextPlugin('styles.css'),
    ],
}

module.exports = config