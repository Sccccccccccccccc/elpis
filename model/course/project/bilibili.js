module.exports = {
    model: 'dashboard',
    name: 'B站大学',
    desc: 'BiliBili管理系统',
    homePage: '/todo?project_key=bilibili&key=video',
    menu: [
        {
            key: 'video',
            name: '视频管理',
        },
        {
            key: 'resource',
            name: '课程资料',
            menuType: 'module',
            moduleType: 'sider',
            siderConfig: {
                menu: [
                    {
                        key: 'pdf',
                        name: 'PDF',
                        menuType: 'module',
                        moduleType: 'custom',
                        customConfig: {
                            path: '/todo'
                        }
                    },
                    {
                        key: 'excel',
                        name: 'Excel',
                        menuType: 'module',
                        moduleType: 'custom',
                        customConfig:{
                            path: '/todo'
                        }
                    },
                    {
                        key: 'ppt',
                        name: 'PPT',
                        menuType: 'module',
                        moduleType: 'custom',
                        customConfig: {
                            path: '/todo'
                        }
                    }
                ]
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