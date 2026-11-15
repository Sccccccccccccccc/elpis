/**
 * 这是中间件入口文件
 * @param {*} app Koa 实例
 * 
 * 此模块与middleware模块逻辑内容相似
 * 
 * 加载所有中间件，可通过 'app.service.${目录}.${文件名}' 访问
 * 
 * 示例：
 * app/service
 *   |
 *   | -- custom-module
 *         |
 *         | -- custom-service.js
 * 
 *   => app.service.customModule.customService
 */
const glob = require('glob');
const path = require('path');
const { sep } = path;


module.exports = (app) => {

    // 读取所有中间件目录 app/service/**/**.js 下所有的文件
    const servicePath = path.resolve(app.businessPath, `.${sep}service`);
    const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}**.js`))
    
    // 遍历所有文件目录，把内容加载到 app.service 下
    const service = {};
    fileList.forEach((file) => {
        
        // 提前文件名称
        // 截取路径 
        // 把 '-' 同意替换为驼峰式
        // 挂载 service 到 app内存中

        let name = path.resolve(file);

        // 截取路径 app/service/custom-module/custom-service.js => custom-module/custom-service
        name = name.substring( name.lastIndexOf(`service${sep}`) + `service${sep}`.length, name.lastIndexOf('.') )

        // 把 '-' 同意替换为驼峰式 custom-module/custom-service => customModule/customService
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase() )
    
        // 挂载 service 到 app 内存中
        let tempService = service;
        const names = name.split(sep);
        for (let i = 0, len = names.length; i < len; ++i) {
            if (i === len - 1) {
                
                const ServiceModule = require(path.resolve(file))(app);
                tempService[names[i]] = new ServiceModule(app);

            }else {
                if (!tempService[names[i]]) {
                    tempService[names[i]] = {};
                }
                tempService = tempService[names[i]];
            }
        }

    })
    app.service = service;

}