{
    mode: 'dashboard', // 模板类型， 不同模板类型对应不一样的模板数据结构
    name: '', // 模板名称
    desc: '', // 模板描述
    icon: '', // 模板图标
    homePage: ''
    // 头部菜单
    menu: [{
        key: '', // 菜单唯一标识
        name: '', // 菜单名称
        menuType: '', // 枚举值： group / module
        // 当 menuType 为 group 时，可填
        subMenu: [{
            // 可递归 menuItem

        }, ...],

        // 当 menuType 为 module 时，可填
        moduleType: '', // 枚举值： sider / iframe / custom / schema

        // 当 moduleType == sider时
        siderConfig: {
            menu: [{
                // 可递归 menuItem (除 moduleType == sider)
            }]
            
        },
        
        // 当 moduleType == iframe时
        iframeConfig: {
            path: '', // iframe路径
            
        },
        // 当 moduleType == custom时
        customConfig: {
            path: '', // 自定义路由
        },
        // 当 moduleType == schema时
        schemaConfig: {
            api: '/api/user', // 数据源API 遵循RESTFUL规范
            schema: {
                // 板块数据结构
                type: 'object',
                properties: {
                    key: {
                        ...schema, // 标准schema配置
                        label: '', // 字段的中文名
                        type: '', // 字段类型
                    },
                    ...
                }
            },
            tableConfig: {
                
            },
            searchConfig: {
                
            },
            components: {

            }


        }

    }, ...]
}