module.exports = (app) => {
    const BaseService = require('./base')(app);
    const modelList = require('../../model/index.js')(app);
    console.log('modelList', JSON.stringify(modelList));
    return class ProjectService extends BaseService {
        
        async getProjectList() {
            // 没有连接到数据库，暂时返回mock数据
            return [
                {
                    id: 1,
                    name: '项目1',
                    desc: '项目1描述'
                },
                {
                    id: 2,
                    name: '项目2',
                    desc: '项目2描述'
                }
            ]
        }
        
    }
}