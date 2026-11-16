module.exports = (app, router) => {

     return class ProjectController {
         
        /**
         * 获取项目列表
         * @param {object} ctx 上下文 viewName 页面名称
         */

        async getList(ctx) {
            const { project: projectService } = app.service;
            const res = await projectService.getProjectList();
            ctx.status = 200;
            ctx.body = {
                success: true,
                data: res,
                metadata: {}
            }
        }
     }
 
}
