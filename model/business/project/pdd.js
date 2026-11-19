module.exports = {

    name: '并夕夕',
    desc: '并夕夕电商系统',
    homePage: '',
    menu: [
        {
            key: 'product',
            name: '商品管理（并夕夕）',

        },
        {
            key: 'client',
            name: '商品管理（并夕夕）',
        },
        {
            key: 'data',
            name: '数据分析',
            menuType: 'module',
            siderConfig: {
                menu: [
                    {
                        key: 'analysis',
                        name: '电商罗盘',
                        menuType: 'custom',
                        customConfig: {
                            path: '/todo'
                        }
                    },
                    {
                        key: 'sider-search',
                        name: '信息查询',
                        menuType: 'iframe',
                        iframeConfig: {
                            path: 'http://www.baidu.com'
                        }
                    }
                ]
            }
        }
    ]

}