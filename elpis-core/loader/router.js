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
    // 注意：必须是 `.${sep}router`（带点），否则 path.resolve 会把 `\router`
    // 当作盘符根路径，得到 C:\router，导致业务路由一个都加载不到
    const routerPath = path.resolve(app.businessPath, `.${sep}router`);
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

    // 路由兜底：未匹配到任何业务路由时执行
    // 只有在显式配置了 homePage、且当前路径不是 homePage 本身时才重定向，
    // 否则会自己重定向到自己，造成无限重定向
    router.get('*', async (ctx, next) => {
        const homePage = app?.options?.homePage;

        if (homePage && homePage !== ctx.path) {
            ctx.status = 302; // 临时重定向
            console.log('触发重定向');
            ctx.redirect(homePage);
        } else {
            ctx.status = 404;
            ctx.body = 'Not Found';
        }
    })

    app.use(router.routes());
    app.use(router.allowedMethods());

}