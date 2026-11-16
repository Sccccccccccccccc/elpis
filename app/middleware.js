/**
 * 这里是用户自定义的中间件
 */

const path = require('path');

module.exports = (app) => {
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

}