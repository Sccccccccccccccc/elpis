/**
 * 运行时异常错误处理， 兜底所有异常
 * @param {[object]} app koa 实例 
 */

module.exports = (app) => {

    return async function errorHandler(ctx, next) {
        
        try {
            await next();
        } catch (err) {
            // 异常处理
            const { status, message, detail } = err;

            app.logger.info(JSON.stringify(err));
            app.logger.error('[--- exception ---]:', err);
            app.logger.error('[--- exception ---]:', status, message, detail);


            if(message && message.indexOf('template not found') > -1) {
                // 进行重定向
                ctx.status = 302; // 临时重定向
                /**
                 * 临时重定向（302）和永久重定向（301）的区别：
                 * 永久重定向：浏览器会记住重定向的地址，下次访问直接跳转到新的地址，不会再次请求服务器。
                 * 临时重定向：浏览器不会记住重定向的地址，每次访问都会请求服务器。
                 * 表现出的现实情况为：
                 * 假如计划新增一个页面，用户访问旧的页面，会提示页面不存在，
                 * 若此时使用了永久重定向，在新页面发布后，用户访问旧的页面，会直接跳转到新页面，而不会提示页面不存在。
                 */

                ctx.redirect(`${app.options?.homePage}`);
            }

            const resBody = {
                success: false,
                code: 50000,
                message: '服务器内部错误'
            }

            ctx.status = 200;
            ctx.body = resBody;

        }

    }

}