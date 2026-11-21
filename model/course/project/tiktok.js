module.exports = {
    model: 'dashboard',
    name: '抖音课堂',
    desc: '抖音课堂管理系统',
    homePage: '/todo?project_key=tiktok&key=video',
    menu: [
        {
            key: 'traffic',
            name: '流量管理',
            menuType: 'module',
            moduleType: 'sider',
            siderConfig: {
                menu: [
                    {
                        key: 'user-traffic',
                        name: '用户流量',
                        menuType: 'module',
                        moduleType: 'custom',
                        customConfig: {
                            path: '/todo'
                        }
                    }
                ]
            }
        }
    ]
}