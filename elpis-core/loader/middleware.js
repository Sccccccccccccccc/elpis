/**
 * 这是中间件入口文件
 * @param {*} app Koa 实例
 * 
 * 加载所有中间件，可通过 'app.middlewares.${目录}.${文件名}' 访问
 * 
 * 示例：
 * app/middleware
 *   |
 *   | -- custom-module
 *         |
 *         | -- custom-middleware.js
 * 
 *   => app.middlewares.customModule.customMiddleware
 */
const glob = require('glob');
const path = require('path');
const { sep } = path;


module.exports = (app) => {

    // 读取所有中间件目录 app/middleware/**/**.js 下所有的文件
    const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`);
    const fileList = glob.sync(path.resolve(middlewarePath, `.${sep}**${sep}**.js`))
    
    // 遍历所有文件目录，把内容加载到 app.middlewares 下
    const middlewares = {};
    fileList.forEach((file) => {
        
        // 提前文件名称
        // 截取路径 
        // 把 '-' 同意替换为驼峰式
        // 挂载 middleware 到 app内存中

        let name = path.resolve(file);

        // 截取路径 app/middleware/custom-module/custom-middleware.js => custom-module/custom-middleware
        name = name.substring( name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length, name.lastIndexOf('.') )

        // 把 '-' 同意替换为驼峰式 custom-module/custom-middleware => customModule/customMiddleware
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase() )
    
        // 挂载 middleware 到 app内存中
        let tempMiddleware = middlewares;
        const names = name.split(sep);
        for (let i = 0, len = names.length; i < len; ++i) {
            if (i === len - 1) {
                // 直接挂载
                tempMiddleware[names[i]] = require(path.resolve(file))(app);
            }else {
                if (!tempMiddleware[names[i]]) {
                    tempMiddleware[names[i]] = {};
                }
                tempMiddleware = tempMiddleware[names[i]];
            }
        }

    })

    // 注意：必须使用 app.middlewares（复数）。
    // Koa 的 app.middleware（单数）是内部用于 compose 的中间件数组，
    // 覆盖成对象后 app.listen() 会抛出 "Middleware stack must be an array!"
    app.middlewares = middlewares;

}