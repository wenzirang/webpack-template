//webpack4.x  区分开发和生产环境
module.exports = function (env, argv) {
    console.log(argv.mode)
    return argv.mode === 'production' ?
        require('./webpackConfigs/webpack.production.js') :
        require('./webpackConfigs/webpack.development.js')
}