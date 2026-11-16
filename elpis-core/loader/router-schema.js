/**
 * router-schema loader
 * @param {object} app Koa 实例
 * 
 * 通过 'json-schema & ajv' 对 API 规则进行校验， 配合 api-params-verifier 中间件使用
 * 
 * app/router-schema/**.js
 * 
 * 示例：
 * app.routerSchema = {
 *    '${api1}' : '${jsonSchema}',
 *    '${api2}' : '${jsonSchema}',
 *     ...
 * }
 */

const glob = require('glob');
const path = require('path');
const { sep } = path;

module.exports = (app) => {

    // 读取 app/router-schema 目录下的所有文件
    const routerSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`);
    const fileList = glob.sync( path.resolve(routerSchemaPath,`.${sep}**${sep}**.js`));

    // 注册所有的 router-schema，使得 app.routerSchema.${api} 可以访问

    let routerSchema = {};

    fileList.forEach((file) => {
        routerSchema = {
            ...routerSchema,
            ...require(path.resolve(file))
        }
    });
    app.routerSchema = routerSchema;
}