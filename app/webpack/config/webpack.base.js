/**
 * webpack5 基础配置
 *
 */
const glob = require("glob");
const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 动态构造 pageEntries
const pageEntries = {};
const htmlWebpackPluginList = [];

// 获取所有入口文件（entry.xxx.js）
const entryFileList = path.resolve(process.cwd(), "./app/pages/**/entry.*.js");
glob.sync(entryFileList).forEach((entryFile) => {

    const entryName = path.basename(entryFile, '.js');
    // 构造 entry
    pageEntries[entryName] = entryFile;
    // 构造最终渲染的页面文件
    htmlWebpackPluginList.push(
        // html-webpack-plugin 辅助注入打包后的bundle文件到tpl文件中
        new HtmlWebpackPlugin({
            filename: path.resolve(process.cwd(), './app/public/dist/', `${entryName}.tpl`),
            template: path.resolve(process.cwd(), './app/view/entry.tpl'),
            chunks: [entryName],
        })
    )

})

module.exports = {
    // 入口配置：pageEntries 是 { 'entry.page1': '路径', 'entry.page2': '路径' }
    entry: pageEntries,
    // 模块解析配置（决定了要加载解释哪些模块，以及用什么方式去解释 ）
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader'
                }
            },
            {
                test: /\.js$/,
                include: [
                    // 只对业务代码进行babel编译, 加快打包速度
                    path.resolve(process.cwd(), './app/pages')
                ],
                // package.json 里声明了 "type": "commonjs"，webpack 会把 .js 当成 CommonJS 解析，
                // 这里强制用 auto 模式，才能正常解析 entry 里的 import/export
                type: 'javascript/auto',
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                // 匹配 .png / .jpg / .jpeg / .gif
                // 原来的 /\.{png,jpg,jpeg,gif}$/ 里 {…} 不是「或」，一个图片后缀都匹配不到
                test: /\.(png|jpe?g|gif)$/i,
                use: {
                    loader: 'url-loader',
                    options:{
                        limit: 300,
                        esModule: false,
                    }
                }
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.less$/,
                use: [ 'style-loader', 'css-loader', 'less-loader' ]
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|otf)$/,
                use: 'file-loader'
            }
        ]
    },
    // 产物输出路径
    // 开发与生产环境不一致，需要在各自环境中自行配置
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/prod'),
        publicPath: '/dist/prod',
        crossOriginLoading: 'anonymous',
    },
    // 配置模块解析的具体行为（定义webpack 在打包时，如何找到并解析具体模块的路径）
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css' ],
        alias: {
            '@': path.resolve(process.cwd(), './app/pages'),
            '$weidgets': path.resolve(process.cwd(), './app/pages/weidgets'),
            '$common': path.resolve(process.cwd(), './app/pages/common'),
            '$store': path.resolve(process.cwd(), './app/pages/store'),
        }
    },
    // 配置插件
    plugins: [
        // 处理,vue文件, 这个插件是必须的
        new VueLoaderPlugin(),
        // 把第三方库暴露到 window content 下
        new webpack.ProvidePlugin({
            Vue: 'vue',
            axios: 'axios',
            _: 'lodash',
        }),
        // 定义全局常量
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true, // 支持 vue 解析 optionsApi
            __VUE_PROD_DEVTOOLS__: false, // 禁用 vue-devtools 调试工具
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // 禁用生产环境显示水合信息
        }),
        // 构造最终渲染的页面模板
        ...htmlWebpackPluginList,
    ],

    // 配置优化(代码分割，模块合并，tree-shaking, 压缩等优化策略)
    optimization: {
        /**
         * 代码分割
         * 把 js 文件打包成多种类型
         * ventor : 第三方库, 基本不会改动
         * common : 业务组件代码的公共部分，改动较少
         * entry.{page} 不用页面 enrty 里的业务组件代码的差异部分，会经常改动
         * 目的： 把改动和频率不一样的js区分出来，以达到更好利用浏览器缓存的效果
         */
        splitChunks: {
            chunks: 'all', // 对同步和异步模块都进行分割
            maxAsyncRequests: 10, // 按需加载时的最大并行请求数
            maxInitialRequests: 10, // 入口点的最大并行请求数
            cacheGroups: {
                // 第三方库
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    priority: 20, // 优先级 数字越大优先级越高
                    enforce: true, // 强制生成
                    reuseExistingChunk: true, // 如果模块已经被打包过，则复用
                },
                // 公共模块
                common: {
                    test: /[\\/]common|widgets[\\/]/,
                    name: 'common',
                    minChunks: 2, // 最小引用次数, 被两处文件引用即被视为公共模块
                    minSize: 1, // 最小分割文件大小 （1 byte）
                    priority: 10, // 优先级
                    reuseExistingChunk: true, // 复用
                },
            }
        },
        // 将 webpack 运行时生产的代码打包到 runtime.js 中
        runtimeChunk: true,
    },
}