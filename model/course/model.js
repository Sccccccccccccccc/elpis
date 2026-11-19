/**
 * 结构详情查看 docs/dashboard-model.js
 */

module.exports = {
    model: 'dashboard',
    name: '课程管理',
    desc: '含视频、用户管理的课程后台',
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