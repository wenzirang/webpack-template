const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const APP_PATH = './src/index.js'
module.exports = {
    entry: {
        main: APP_PATH,
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'main/[name].js',
        chunkFilename: 'chunk/[name].[chunkhash:5].chunk.js',
    },
    stats: { children: false },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                query: {compact: false},
                exclude: '/node_modules/'
            }, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    "postcss-loader"
                ]
            }, {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    "postcss-loader",
                    'less-loader'
                ]
            }, {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    "postcss-loader",
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    //使用插件时带上的参数
                    options: {
                        name: 'assets/images/[name].[hash:4].[ext]',
                    }
                }]
            },
            // 字体loader
            {
                test: /\.(eot|woff|woff2|ttf|svg)$/,
                loader: 'url-loader',
                query: {
                    name: 'assets/font/[name]-[hash:8].[ext]'
                }
            },
            {
                test: /\.html$/,
                use: [
                    'html-loader'
                ]
            }
        ]
    },
    // 在webpack启动后会从配置入口模块触发找出所有的以来模块  resolve配置webpack如何寻找这些模块
    resolve: {
        // 通过匹配后缀
        extensions: ['.js', '.jsx', '.json', '.less', '.scss', 'css'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js', 
            '@': path.resolve(__dirname, "../src")
        }
    },
    plugins: [
        //生成开发环境中的虚拟html文件
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'), // 配置文件模板
            minify: {
                minifyCSS: true,
                minifyJS: true,
                collapseWhitespace: true, // 删除空白符与换行符
                removeAttributeQuotes: true // 移除HTML中的属性引号
            }
        }),
        // 全局引用
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        // 拷贝静态资源
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../staticConfig'),
                to: path.resolve(__dirname, '../dist/staticConfig')
            }
        ]),
    ],
}