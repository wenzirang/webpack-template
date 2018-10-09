const merge = require('webpack-merge');
const webpack = require('webpack');
const base = require("./webpack.base.js");
const path = require('path');

const config = merge.smart(base, {
    devServer: {
        // host: '0.0.0.0',
        port: 8989,
        hot: true,
        overlay: true,
        open: true
    }
})
config.plugins.push(
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true),
    }),
    new webpack.HotModuleReplacementPlugin(), //热更新插件
)

module.exports = config