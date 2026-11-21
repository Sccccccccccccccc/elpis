module.exports = {

    name: '狗东11',
    desc: '狗东电商系统',
    homePage: '/todo?project_key=jd&key=product',
    menu: [
        {
            key: 'shop-setting',
            name: '店铺设置',
            menuType: 'group',
            subMenu: [
                {
                key: 'info-setting',
                name: '店铺信息设置',
                moduleType: 'custom',
                customConfig: {
                    path: '/todo'
                }
            },
            {
                key: 'logo-setting',
                name: '店铺logo设置',
                moduleType: 'custom',
                customConfig: {
                    path: '/todo'
                }
            }
        ]

        },
        {
            key: 'quality-setting',
            name: '店铺资质',
            menuType: 'module',
            moduleType: 'iframe',
            iframeConfig: {
                path: 'https://www.baidu.com'
            }
        },

    ]

}