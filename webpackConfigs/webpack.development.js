const merge = require('webpack-merge');
const webpack = require('webpack');
const base = require("./webpack.base.js");

const config = merge.smart(base, {
    devServer: {
        port: 8989,
        hot: true,
        overlay: true,
        compress: true,
        open: true,
        historyApiFallback: true
    }
})
config.plugins.push(
    new webpack.HotModuleReplacementPlugin(), //热更新插件
)

module.exports = config