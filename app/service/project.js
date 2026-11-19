module.exports = (app) => {
    const BaseService = require('./base')(app);
    const modelList = require('../../model/index.js')(app);
    return class ProjectService extends BaseService {
        /**
         * 获取所有模型与项目的结构化数据
         */
        async getModelList() {
            // 没有连接到数据库，暂时返回mock数据
            return modelList;
        }
        
    }
}