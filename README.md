# webpack-4
webpack@4 基础项目环境 适用于搭建vue React Angular 只需在上面累加修改相对应前端框架语言

## 目录结构说明

```js

- src
  + css         // 静态资源 css文件 可编写.css .less .scss
  + img         // 静态资源 图片文件
  + js          // js文件
  + index.js    // 入口文件
  + index.html  // 模板
- webpackConfigs
  + webpack.base.js           //webpack配置公用文件
  + webpack.development.js    //开发环境配置文件
  + webpack.production.js     //生产环境配置文件
- package.json                //项目描述文件
- .babelrc                    // babel的配置文件
- webpack.config              //webpack根文件
- README.md
```




##webpack4 文件解析

```js
 + webpack.config.js    //webpack根文件  当没有配置指令所制定的webpack文件时 默认会找此文件，此文件可用来做mode的拦截   区分开发和生产环境
 + webpack.base.js      //webpack公用文件,可将一些model.rules的相同判断规则，插件的使用，入口配置，出口配置 写在此文件
 + webpack.dev.js       //webpack开发环境配置的文件，可在此文件编写 devserver相关配置
 + webpack.pord.js      //webpack生产环境配置文件，可配置压缩规则

```

##区分环境

``` js
 
    //webpack4.x  区分开发和生产环境  可在package.json中执行命令中 使用modl划分
    module.exports = function (env, argv) {
        console.log(argv.mode)
        return argv.mode === 'production' ?
            require('./webpack.prod.js') :
            require('./webpack.dev.js')
    }
```

##入口文件

```js
     +单一入口
        const APP_PATH = '---入口文件地址---'
        module.exports = {
            entry:{
                app: APP_PATH
            }
        }
    +多入口  
        const DASHBORD_PATH = '---入口文件一---';
        const LOGIN_PATH = '---入口文件二---';
        module.exports = {
            entry:{
                DashBoard : DASHBORD_PATH,
                Login : LOGIN_PATH
            }
        }
```

##出口文件

``` js
        +单一出口
        module.exports = {
            output:{
                path: path.resolve(__dirname,'dist'),
                filename: 'main.js'
            }
        }
        +多出口
        module.exports = {
            output:{
                path: path.resolve(__dirname,'dist'),
                filename:'[name].js',
                chunkFilename:'js/[name].[chunkhash:5].js'
            }
        }
```

>每个HTML页面就相当于一个入口起点,单页应用(spa):有且只有一个入口文件,多页应用(mpa):多个入口起点

##module

``` js
    -module 对象中可配置一些在webpack解析时候的规则 以及使用那些解析器
    module.exports = {
        module:{
            noParse:/ jquery | lodsh /   //忽略大型库文件(library)可以提高构建性能。
            // 编写的解析匹配规则
            rules:[
                {
                    test:/\.css$/, //正则的匹配规则 可根据自己所需要解析的文件特征编写规则
                    //pitching 阶段：loader 上的 pitch 方法，按照 后置(post)、行内(normal)、普通(inline)、前置(pre) 的顺序调用
                    //normal   阶段：loader 上的 常规方法，按照 前置(pre)、行内(normal)、普通(inline)、后置(post) 的顺序调用。模块源码的转换，发生在这个阶段。
                    //指定 loader 种类。没有值表示是普通 loader。
                    //还有一个额外的种类"行内 loader"，loader 被应用在 import/require 行内。
                    //所有一个接一个地进入的 loader，都有两个阶段：
                    enforce:"pre | post"
                    //制定此匹配规则不再此文件中去解析
                    exclude：'/node_modules/'
                    use:[ 
                        loader:'css-loader', //加载的解析器
                        loaders:['css-loader','style-loader'] //多个解析器
                        {
                            loader:'css-loader',
                            options:{
                                limit: 8192, //大小
                                name: 'img/[name].[hash:4].[ext]', //解析后生成的名字
                                minimize: true //是否压缩
                        }
                    ]
                }
            ]
        }
    }
```

>在进行生产环境module配置时,可通过MiniCssExtractPlugin 进行css 的压缩 通过url-loader 进行图片地址的解析
>可通过image-webpack-loader 进行图片压缩,通过html-loader进行html解析

## Resolve
###alias
 >-resolve配置模板如何解析当我们在js中import 或 require 时 可在 resolve.alias中做配置这样在编写代码中导入库 使得很方便。列：

``` js
    module.exports={
        resolve:{
            alias:{
                components: path.resolve(__dirname,'./src/components')
            }
        }
    }
    //在代码中可以这样导入
    import Button  form components/button;
```

>当你通过 `import Button from 'components/button`导入时,实际上被Reslve.Alias等价替代为 `import Button from ./src/components/button` alise的配置含义就是将导入语句中的关键字做等阶替换,alise还有$符号 来缩小范围

``` js
    module.exports = {
        resolve:{
            alias:{
                componets$: path.resolve(__dirname,'./src/compoents')
            }
        }
    // 将会产生如下结果
    import button from 'componets'; // 精确匹配，所以被解析path/to/file.js
    import button from 'componets/button.js'; // 非精确匹配，触发普通解析
```

##extensions

>再导入语句中没有带文件后缀时 我们可以通过配置extensions来解决后缀匹配的问题webpack会通过我们在extensions配置的后缀列表来做顺序匹配 列：

``` js
    module.exports = {
        resolve:{
            extensions:['.ts','.js','.json','.css','.less','.scss']
        }
    }
```

## optimization

>从webpack4x开始 官方移除了commonchunck插件 改用 optimiztion属性进行灵活的配置，这也是从webpac3x迁移到4x中比较复杂的一面


###optimization.runtimeChunk

>优化持久化缓存使用的 runtime 指的是webpack的运行环境（具体作用就是模板解析，加载）和模块信息清单，当每次有模块变更时都会变更，所以我们想吧这部分代码单独打包出来，配合后端缓存策略，这样就不会因为某个模块的便跟导致包含模块信息的模块缓存失败,而 `oprimizition.runtimeChunk`就是告诉webpack是否要吧这一部分单独打包出来(分包策略)

``` js
    module.exports = {
        optimization:{
            runtimeChunk：{
                name：'runtime'
            }
        }
    }
```
>具体解释

![runtime](./assets/runtime.png)

###minimizer 或 minimize

``` js
    module.exports = {
        optimization:{
            minimize: true //告诉webpack使用默认的最小化捆绑包
            // 允许自定义配置一个或多个UglifyjsWebpackPlugin实例来覆盖默认最小化器
            minimizer: [
                new OptimizeCssAssetsPlugin({}), // 压缩 css,使用minimizer会自动取消webpack的默认配置，所以记得用UglifyJsPlugin
                new UglifyJsPlugin({
                    // 压缩 js
                    uglifyOptions: {
                    ie8: true, //是否启用ie8的兼容
                    ecma: 8, //支持的ECMAScript的版本
                    cache: true, //是否启用文件缓存
                    }
                })
            ]
        }
    }
```

## plugins

>plugins选项用于定义各种方式自定义webnpack的构建过程，webpack附带了各种内置插件 可以通过访问这个页面<a href="https://webpack.docschina.org/plugins/" target="_blank">plugins</a>来了解更多的插件使用,再此处 举例一些插件

``` js
    module.exports = {
        plugins:[
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
            // webpack 代码执行时候的仪表盘插件
            new DashboardPlugin(),
            //在打包创建文件时 清空打包文件的插件
            new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../')
            }),
            //压缩css 为每个css文件创建一个独立的打包文件
            new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css'
            }),            
        ]
    }
```