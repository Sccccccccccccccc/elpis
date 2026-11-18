// 基类配置
const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// dev-server 配置
const DEV_SERVER_CONFIG = {
    HOST: '127.0.0.1',
    PORT: 9002,
    HMR_PATH: '/__webpack_hmr', // 官方规定
    TIMEOUT: 20000,
}

// 开发阶段的 entry 配置需要加入 hmr
Object.keys(baseConfig.entry).forEach( v => {
    // 第三方包不作为 hmr 入口
    if (v !== 'vendor') {
        baseConfig.entry[v] = [
            // 主入口文件
            baseConfig.entry[v],
            // hmr 更新入口，官方指定的hmr路径
            // 注意：HMR_PATH 本身以 / 开头，这里不能再拼 '/'，否则会得到 //__webpack_hmr
            `webpack-hot-middleware/client?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true`
        
        ]
   
    }
})


// 生产环境 webpack 配置
const webpackConfig = merge(baseConfig, {
    // 指定开发坏境模式
    mode: 'development',
    // souceMap 配置, 呈现代码的映射关系，方便调试
    devtool: 'cheap-module-eval-source-map',
    // 生产环境的 output 配置
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.resolve(process.cwd(), './app/public/dist/dev'), // 输出文件存储路径
        publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev/`, // 外部资源公共路径
        globalObject: 'this',
    },
    plugins: [
        // HotModuleReplacementPlugin 用于实现热模块替换 简称HMR 
        // 模块热替换允许应用在运行时替换模块，可提升开发效率
        new webpack.HotModuleReplacementPlugin({
            multiStep: false,
        }),
    ]
})

module.exports = {
    // webpack 配置
    webpackConfig,
    // dev-server 配置, 暴露给dev.js使用
    DEV_SERVER_CONFIG
};