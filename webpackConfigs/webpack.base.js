const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const APP_PATH = './src/index.js'
const DashboardPlugin = require('webpack-dashboard/plugin')
module.exports = {
    entry: {
        app: APP_PATH
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        chunkFilename: 'js/[name].[chunkhash:5].min.js',
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                use: [
                    'babel-loader',
                ],
                //exclude是定义不希望babel处理的文件  
                exclude: '/node_modules/'
            }, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            }, {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }, {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    //使用插件时带上的参数
                    options: {
                        limit: 8192,
                        name: 'img/[name].[hash:4].[ext]',
                    }
                }]
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
        extensions: ['.js', '.jsx', '.json', '.less', '.scss', 'css']
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
        new DashboardPlugin()
    ],
}