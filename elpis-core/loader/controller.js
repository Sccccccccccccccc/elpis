/**
 * 这是中间件入口文件
 * @param {*} app Koa 实例
 * 
 * 此模块与middleware模块逻辑内容相似
 * 
 * 加载所有中间件，可通过 'app.controller.${目录}.${文件名}' 访问
 * 
 * 示例：
 * app/controller
 *   |
 *   | -- custom-module
 *         |
 *         | -- custom-controller.js
 * 
 *   => app.controller.customModule.customController
 */
const glob = require('glob');
const path = require('path');
const { sep } = path;


module.exports = (app) => {

    // 读取所有中间件目录 app/controller/**/**.js 下所有的文件
    const controllerPath = path.resolve(app.businessPath, `.${sep}controller`);
    const fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}**.js`))
    
    // 遍历所有文件目录，把内容加载到 app.controller 下
    const controller = {};
    fileList.forEach((file) => {
        
        // 提前文件名称
        // 截取路径 
        // 把 '-' 同意替换为驼峰式
        // 挂载 controller 到 app内存中

        let name = path.resolve(file);

        // 截取路径 app/controller/custom-module/custom-controller.js => custom-module/custom-controller
        name = name.substring( name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf('.') )

        // 把 '-' 同意替换为驼峰式 custom-module/custom-controller => customModule/customController
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase() )
    
        // 挂载 controller 到 app 内存中
        let tempController = controller;
        const names = name.split(sep);
        for (let i = 0, len = names.length; i < len; ++i) {
            if (i === len - 1) {
                
                const ControllerModule = require(path.resolve(file))(app);
                tempController[names[i]] = new ControllerModule(app);

            }else {
                if (!tempController[names[i]]) {
                    tempController[names[i]] = {};
                }
                tempController = tempController[names[i]];
            }
        }

    })

    app.controller = controller;

}