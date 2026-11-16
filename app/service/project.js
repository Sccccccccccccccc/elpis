module.exports = (app) => {
    const BaseService = require('./base')(app);
    return class ProjectService extends BaseService {
        
        async getProjectList() {
            // 没有连接到数据库，暂时返回mock数据
            return [
                {
                    id: 1,
                    name: '项目1'
                },
                {
                    id: 2,
                    name: '项目2'
                }
            ]
        }
        
    }
}