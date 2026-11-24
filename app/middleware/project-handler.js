/**
 * projectHandler 项目相关内容处理 (类似于java中的拦截器)
 * 
 */
module.exports = (app) => {

    return async (ctx, next) => {
        // 只对业务 API 进行 project_key 处理
        if (ctx.path.indexOf('/api/project/') < 0) {
            return await next();
        }

        // 获取 project_key
        const { project_key } = ctx.request.headers;

        if (!project_key) {
            ctx.status = 200;
            ctx.body = {
                success: false,
                message: '缺少项目标识',
                code: 446
            }
        }

        await next();
    }
}