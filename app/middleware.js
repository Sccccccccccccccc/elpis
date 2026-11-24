/**
 * 这里是用户自定义的中间件
 */

const path = require('path');

module.exports = (app) => {
    // 静态根目录配置
    const koaStatic = require('koa-static');
    app.use(koaStatic(path.resolve( process.cwd(), './app/public')));

    // 模板渲染引擎
    const koaNunjucks = require('koa-nunjucks-2');

    app.use(koaNunjucks({
        ext: 'tpl',
        path: path.resolve( process.cwd(), './app/public'),
        nunjucksConfig: {
            noCache: true,
            trimBlocks: true,
        }
    }))

    // 引入 ctx.bodyParser 
    const bodyParser = require('koa-bodyparser');
    app.use(bodyParser({
        formLimit: '1000mb',
        enableTypes: ['json', 'form', 'text']
    }));

    // 异常捕获中间件引入
    app.use(app.middlewares.errorHandler);

    // 签名合法性校验
    app.use(app.middlewares.apiSignVerify);

    // 引入 API 参数校验
    app.use(app.middlewares.apiParamsVerify);

    // 引入项目处理中间件
    app.use(app.middlewares.projectHandler);
}