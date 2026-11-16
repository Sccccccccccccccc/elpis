const Koa = require('koa');
const path = require('path');

const env = require('./env');
const middlewareLoader = require('./loader/middleware');
const routerSchemaLoader = require('./loader/router-schema');
const routerLoader = require('./loader/router');
const controllerLoader = require('./loader/controller');
const serviceLoader = require('./loader/service');
const configLoader = require('./loader/config');
const extendLoader = require('./loader/extend');

const { sep } = path;

module.exports = {
    start(options) {

        /**
         * 启动项目
         * @params {Object} options 启动参数
         * 
         * options = {
             name: '项目名称',
             homePath: '项目首页',
         }
         */

        // 创建KOA实例
        const app = new Koa();

        // 应用配置
        app.options = options;
        
        // 应用根目录
        app.baseDir = process.cwd();        

        // 业务文件路径
        app.businessPath = path.resolve(app.baseDir, `.${sep}app`); 
        
        // 初始化环境配置
        app.env = env()
        
        // 加载中间件
        middlewareLoader(app);        

        // 加载路由
        routerSchemaLoader(app); 

        // 加载controller
        controllerLoader(app);

        // 加载service
        serviceLoader(app);        

        // 加载config
        configLoader(app);

        // 加载extend
        extendLoader(app);
        
        // 注册全局中间件（为用户提供自定义中间件入口）
        try {
            require(`${app.businessPath}${sep}middleware.js`)(app)
            console.log('全局中间件已注册');
        } catch (err) {
            console.log('全局中间件注册失败');
        }

        // 注册路由 放到最后
        routerLoader(app);

        // 启动服务

        try {
            const port = 3000 || process.env.PORT;
            const host = '0.0.0.0' || process.env.HOST;

            app.listen(port, host, () => {
            console.log(`elpis-core is running at http://${host}:${port}`);
            })
        } catch (error) {
            console.log(error);
        }
 
    }
}


