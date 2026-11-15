/**
 * router loader
 * @param {object} app Koa 实例
 * 
 * 解析所有 app/router 下所有js文件，加载到KoaRouter实例中
 */


const KoaRouter = require('koa-router');
const glob = require('glob');
const path = require('path');
const { sep } = require('path');
module.exports = (app) => {
    // 找到路由文件路径
    const routerPath = path.resolve(app.businessPath, `${sep}router`);
    // 实例化 koa-router
    const router = new KoaRouter();
    // 注册所有路由
    const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}**.js`))
    fileList.forEach((file) => {

        // module.exports = (app, router) => {
        //     router.get('/test', async (ctx, next) => {
        // }
  
        require(path.resolve(file))(app, router);
    })

    // 路由兜底
    router.get('*', async (ctx, next) => {
        ctx.status = 302; // 临时重定向
        ctx.redirect(`${app?.options?.homePage ?? '/'}`);
    })

    app.use(router.routes());
    app.use(router.allowedMethods());

}