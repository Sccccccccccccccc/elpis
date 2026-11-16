module.exports = (app, router) => {
    const BaseController = require('./base')(app);
     return class ProjectController extends BaseController {
         
        /**
         * 获取项目列表
         * @param {object} ctx 上下文 viewName 页面名称
         */

        async getList(ctx) {
            const { project: projectService } = app.service;
            const projectList = await projectService.getProjectList();
            this.success(ctx, projectList);
        }
     }
 
}
