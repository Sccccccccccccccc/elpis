/**
 * 结构详情查看 docs/dashboard-model.js
 */

module.exports = {
    model: 'dashboard',
    name: '课程管理',
    menu: [
        {
            key: 'video',
            name: '视频管理',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
                path: '/todo',
            }
        },
        {
            key: 'user',
            name: '用户管理',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
                path: '/todo',
            }
        },
    ]
}