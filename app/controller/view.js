module.exports = (app, router) => {

     return class ViewRouter {
         
        /**
         * 渲染页面
         * @param {object} ctx 上下文 viewName 页面名称
         */

        async render(ctx) {
            await ctx.render(`dist/entry.${ctx.params.page}`, {
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
