module.exports = (app) => {
    const BaseService = require('./base')(app);
    const modelList = require('../../model/index.js')(app);
    return class ProjectService extends BaseService {

        /**
         * 根据 project_key 获取项目配置
         */
        get( project_key ) {
            let projectConfig;

            modelList.forEach((modelItem) => {
                if( modelItem.project[project_key] ) {
                    projectConfig = modelItem.project[project_key];
                }
            });

            return projectConfig;
        }

        /**
         * 获取当前 ProjectKey 模型下的项目列表（如果无 ProjectKey, 全量获取）
         */
        getList({ project_key }) {
            const projectList = [];
            modelList.forEach((modelItem) => {
                const { project } = modelItem;                
                // 如果有传project_key，则只获取该ProjectKey下的项目， 不传的情况下获取全量
                console.log('--------service [getList]--------', project_key, project);
                
                if (project_key && !project[project_key]) { 
                    console.log('收到ProjectKey', project_key);
                    return;
                 };

                for (const key in project) {
                    projectList.push(project[key]);
                }

            });
            return projectList;
        }

        /**
         * 获取所有模型与项目的结构化数据
         */
        async getModelList() {
            // 没有连接到数据库，暂时返回mock数据
            return modelList;
        }
        
    }
}