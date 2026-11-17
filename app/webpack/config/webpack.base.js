/**
 * webpack5 基础配置
 *
 */

const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // 入口配置
    entry: {
        'entry.page1': './app/pages/page1/entry.page1.js',
        'entry.page2': './app/pages/page2/entry.page2.js'
    },
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
            '@': path.join(process.cwd(), './app'),
        }
    },
    // 配置插件
    plugins: [
        // 处理,vue文件, 这个插件是必须的
        new VueLoaderPlugin(),
        // 把第三方库暴露到 window content 下
        new webpack.ProvidePlugin({
            Vue: 'vue',
        }),
        // 定义全局常量
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true, // 支持 vue 解析 optionsApi
            __VUE_PROD_DEVTOOLS__: false, // 禁用 vue-devtools 调试工具
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // 禁用生产环境显示水合信息
        }),
        // 构造最终渲染的页面模板
        new HtmlWebpackPlugin({
            // 产物（最终模板）输出路径
            filename: path.resolve(process.cwd(), './app/public/dist/', 'entry.page1.tpl'),
            // 指定要使用的模板
            template: path.resolve(process.cwd(), './app/view/entry.tpl'),
            // 要注入的代码块
            chunks: ['entry.page1'],
        }),
        new HtmlWebpackPlugin({
            // 产物（最终模板）输出路径
            filename: path.resolve(process.cwd(), './app/public/dist/', 'entry.page2.tpl'),
            // 指定要使用的模板
            template: path.resolve(process.cwd(), './app/view/entry.tpl'),
            // 要注入的代码块
            chunks: ['entry.page2'],
        })
    ],

    // 配置优化(代码分割，模块合并，tree-shaking, 压缩等优化策略)
    optimization: {
        
    },
}