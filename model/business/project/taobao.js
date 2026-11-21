module.exports = {

    name: '淘宝',
    desc: '淘宝电商系统',
    homePage: '',
    menu: [
        {
            key: 'order',
            moduleType: 'iframe', // 这里覆盖了原有的moduleType
            iframeConfig: {
                path: 'https://www.baidu.com'
            }
        },
        {
            key: 'operating',
            name: '运营活动',
            menuType: 'module',
            moduleType: 'sider',
            siderConfig: {
                menu: [
                    {
                        key: 'coupon',
                        name: '優惠券',
                        menuType: 'module',
                        moduleType: 'custom',
                        customConfig: {
                            path: '/todo',
                        }
                    },
                    {
                        key: 'limited',
                        name: '限量購',
                        menuType: 'module',
                        moduleType: 'custom',
                        customConfig: {
                            path: '/todo',
                        }
                    },
                    {
                        key: 'festival',
                        name: '節日活動',
                        menuType: 'module',
                        moduleType: 'custom',
                        customConfig: {
                            path: '/todo',
                        }
                    },
                ]
            }
        }
    ]

}