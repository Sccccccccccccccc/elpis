module.exports = (app, router) => {

     return class ViewRouter {
         
        /**
         * 渲染页面
         * @param {object} ctx 上下文 viewName 页面名称
         */

        async render(ctx) {
            // 路由参数在 ctx.params 上（ctx.request 上没有 params），query 用 ctx.query
            app.logger.info(`[ViewController] url: ${ctx.url}`);
            app.logger.info(`[ViewController] query: ${JSON.stringify(ctx.query, null, 2)}`);
            app.logger.info(`[ViewController] params: ${JSON.stringify(ctx.params, null, 2)}`);

            await ctx.render(`dist/entry.${ctx.params.page}`, {
                project_key: ctx.query.project_key,
                name: app.options?.name,
                env: app.env.get(),
                options: JSON.stringify(app.options),
            });
        }

        /**
         * 验证 bodyParser 是否生效
         * 请求体被 koa-bodyparser 解析后挂到 ctx.request.body
         * @param {object} ctx 上下文
         */
        async testBodyParser(ctx) {
            const body = ctx.request.body;

            ctx.body = {
                success: true,
                bodyParser: body !== undefined,
                contentType: ctx.request.type,
                received: body ?? null,
                keys: body && typeof body === 'object' ? Object.keys(body) : [],
                time: new Date().toISOString(),
            };
        }
     }
 
}
