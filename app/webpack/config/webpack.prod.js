// 基类配置
const baseConfig = require('./webpack.base.js');

const merge = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebPackPlugin = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');

const path = require('path');

// 生产环境需要覆盖基础配置里的 js/css/less 规则，
// 先剔除这三条，避免 merge.smart 把 loader 叠加成重复组合
const overriddenTestSources = ['\\.js$', '\\.css$', '\\.less$'];
const baseModuleRules = baseConfig.module.rules.filter((rule) => {
    return !(rule.test instanceof RegExp && overriddenTestSources.includes(rule.test.source));
});

const baseWithoutOverriddenRules = {
    ...baseConfig,
    module: {
        ...baseConfig.module,
        rules: baseModuleRules,
    },
};

// 生产环境 webpack 配置
const webpackConfig = merge.smart(baseWithoutOverriddenRules, {
    // 指定生产环境
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    // 只对业务代码进行babel编译, 加快打包速度
                    path.resolve(process.cwd(), './app/pages')
                ],
                type: 'javascript/auto',
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
        ]
    },
    // 生产环境的 output 配置
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/prod'),
        publicPath: '/dist/prod',
        crossOriginLoading: 'anonymous',
    },

    // webpack 不会有大量hits信息，默认为warning
    performance: {
        hints: false
    },
    plugins: [
        // 每次build前清空dist目录
        new CleanWebPackPlugin(['public/dist'], {
            root: path.resolve(process.cwd(), './app/'),
            exclude: [], // 不删除的文件
            verbose: true, // 是否输出日志
            dry: false, // 是否删除文件
        }),

        // 提前css 的公共部分，有效利用缓存（ 非公共部分使用inline ）
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[contenthash:8].css',
            chunkFilename: 'css/[name]_[contenthash:8].css',
        }),

        // 浏览器在请求资源时，不发送用户的身份凭证
        new HtmlWebpackInjectAttributesPlugin({
            crossorigin: 'anonymous'
        })
    ],
    optimization: {
        minimize: true,
        // JS 交给 webpack 5.112 自带的 minimizer（terser 5）
        minimizeOptions: {
            javascript: {
                compress: {
                    drop_console: true // 清除 console.log
                }
            }
        },
        // CSS 单独压缩；webpack 会自动再补上 JS 的默认 minimizer
        minimizer: [
            new CssMinimizerPlugin({
                parallel: false
            })
        ]
    }
})

module.exports = webpackConfig;
