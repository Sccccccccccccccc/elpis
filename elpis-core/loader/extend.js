/**
 * 这是中间件入口文件
 * @param {*} app Koa 实例
 * 
 * 此模块与middleware模块逻辑内容相似
 * 
 * 加载所有中间件，可通过 'app.extend.${目录}.${文件名}' 访问
 * 
 * 示例：
 * app/extend
 *   |
 *   | -- custom-extend.js
 * 
 *   => app.extend.customExtend
 */
const glob = require('glob');
const path = require('path');
const { sep } = path;


module.exports = (app) => {

    // 读取所有中间件目录 app/extend/**.js 下所有的文件
    const controllerPath = path.resolve(app.businessPath, `.${sep}extend`);
    const fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}**.js`))
    
    // 遍历所有文件目录，把内容加载到 app.extend 下
    const extend = {};
    fileList.forEach((file) => {
        
        // 提前文件名称
        // 截取路径 
        // 把 '-' 同意替换为驼峰式
        // 挂载 extend 到 app内存中

        let name = path.resolve(file);

        // 截取路径 app/extend/custom-extend.js => custom-extend
        name = name.substring( name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length, name.lastIndexOf('.') )

        // 把 '-' 同意替换为驼峰式 custom-extend => customExtend
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase() )
    
        // 过滤 app 已经存在的 key
        for( const key in app ) {
            if( key === name ) {
                console.log(`app.extend.${name} is exists!`);
                return;
            }
        }

        // 挂载 extend 到 app 内存中
        app[name] = require(path.resolve(file))(app);

    })

    app.extend = extend;

}