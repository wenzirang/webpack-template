const path = require('path');
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin') //抽离css文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, "src"),
        compress: true,
        port: 8989,
        // host: '0.0.0.0',
        open: true
        // watchContentBase: true,
        // hot: true
    },
    //入口文件
    entry: './src/index.js',
    //出口文件
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    //可以把 loader理解为是一个转换器，负责把某种文件格式的内容转换成 webpack 可以支持打包的模块
    module: {
        rules: [{
                test: /(\.jsx|\.js)$/, //匹配文件路径的规则，通常我们都是匹配文件的后缀名
                include: [
                    path.resolve(__dirname, 'src') //制定那些路径下匹配规则的文件需要进行loader处理
                ],
                use: 'babel-loader', //制定使用什么插件进行转换                
                exclude: '/node_modules/' //exclude是定义不希望babel处理的文件                
            },
            {
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'less-loader'
                    ]
                })
            },
            {
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'sass-loader'
                    ]
                })

            },

            {
                test: /\.(png|jpg|gif)/,
                use: [{ 
                    loader: 'file-loader',
                    options: {}
                }]
            }
        ]
    },
    // 代码模块路径解析的配置
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, 'src'),
        ],
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.ts']
    },
    //使用什么插件
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),
        // new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].css')
    ]
}