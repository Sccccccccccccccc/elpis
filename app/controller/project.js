module.exports = (app, router) => {
    const BaseController = require('./base')(app);
     return class ProjectController extends BaseController {

        /**
         * 根据 ProjectKey 获取项目配置
         */

        get(ctx) {
            const { project_key: projectKey } = ctx.request.query;
            const { project: projectService } = app.service;
            const projectConfig = projectService.get(projectKey);

            if (!projectConfig) {
                this.fail(ctx, 50000, '获取项目异常');
                return;
            }

            this.success(ctx, projectConfig);

        }

        /**
         * 获取当前 ProjectKey 模型下的项目列表（如果无 ProjectKey, 全量获取）
         */
        getList(ctx) {                        
            const { project_key: projectKey } = ctx.request.query;
            const { project: projectService } = app.service;
            // service 内部按 project_key 解构，这里必须保持同名，不能简写成 { projectKey }
            const projectList = projectService.getList({ project_key: projectKey });

            const dtoProjectList = [];

            // 构造关键数据 list
            projectList.forEach(project => {
                const { modelKey, key, name, desc, homePage } = project;
                dtoProjectList.push({
                    modelKey,
                    key,
                    name,
                    desc,
                    homePage
                })
            })

            this.success(ctx, dtoProjectList);

        }
         
        /**
         * 获取所有模型与项目的结构化数据
         */
        async getModelList(ctx) {
            const { project: projectService } = app.service;
            const modelList = await projectService.getModelList();

            //构造返回结果，只返回关键数据
            const dtoModelList = modelList.reduce((preList, item) => {
                const { model, project } = item;
                
                // 构造model关键数据
                const { key, name, desc } = model;
                const dtoModel = { key, name, desc };

                // 构造project关键数据
                // const dtoProject = Object.keys(project).reduce((preProject, projKey) => {
                //    const { key, name, desc, homePage } = project[projKey];
                //    preObj[projKey] = { key, name, desc, homePage };
                //    return preObj;
                // })

                const  dtoProject = {};
                for (const projKey in project) {
                    const { key, name, desc, homePage } = project[projKey];
                    dtoProject[projKey] = { key, name, desc, homePage };
                }

                preList.push({
                    model: dtoModel,
                    project: dtoProject
                })

                return preList;
            }, [])

            this.success(ctx, dtoModelList);
        }
     }
 
}
