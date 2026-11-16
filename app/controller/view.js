module.exports = (app, router) => {

     return class ViewRouter {
         
        /**
         * 渲染页面
         * @param {object} ctx 上下文 viewName 页面名称
         */

        async render(ctx) {
            await ctx.render(`output/entry.${ctx.params.page}`, {
                name: app.options?.name,
                env: app.env.get(),
                options: JSON.stringify(app.options),
            });
        }
     }
 
}
