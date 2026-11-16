/**
 * config loader
 * @param {object} app Koa 实例
 * 
 * 配置区分 本地/测试/生产环境
 * 通过env环境读取不同文件配置 env.config
 * env.config 覆盖 default.config 加载到 app.config
 * 
 * 目录下对应的config配置
 * 默认配置 config/config.default.js
 * 本地配置 config/config.local.js
 * 测试配置 config/config.beta.js
 * 生产配置 config/config.prod.js
 */

const path = require("path")
const { sep } = path

module.exports = (app) => {
    // 找到 config/ 目录
    const configPath = path.resolve(app.baseDir, `.${sep}config`)

    // 获取 default.config
    let defaultConfig = {};
    try {
        defaultConfig = require( path.resolve(configPath, `.${sep}config.default.js`));
    } catch(e) {
        console.log(' config.default.js 文件不存在 ', configPath, sep)
    }

    // 获取 env.config
    let envConfig = {};
    try {

        if(app.env.isLocal()) {
            envConfig = require( path.resolve(configPath, `.${sep}config.local.js`));
        }else if(app.env.isBeta()) {
            envConfig = require( path.resolve(configPath, `.${sep}config.beta.js`));
        }else if(app.env.isProd()) {
            envConfig = require( path.resolve(configPath, `.${sep}config.prod.js`));
        }

    }catch(e) {
        console.log(' env.config.js 文件不存在', e.message)
    }

    // 覆盖并加载config配置
    app.config = Object.assign({}, defaultConfig, envConfig);
    console.log('app.config', app.config, 'NODE_ENV', process.env.NODE_ENV);
    
}