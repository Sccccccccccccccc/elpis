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

                        // 字段在 table 中的相关配置
                        tableConfig: {
                            ...elTableColumnConfig, // 标准 el-table-column 配置
                            toFixed: 0, // 保留小数点后几位
                            visiable: true, // 是否在表格中显示, 默认为true, false时表示不在表单中展示
                        },

                        // 字段在 search-bar 中的相关配置
                        searchConfig: {
                            ...elComponentConfig, // 标准 el-component(el-form、el-input、el-select等) 配置
                            comType: '', // 配置组件类型 'input/select/...'
                            default: '', // 搜索框展示的默认值

                            // 当 comType 为 select 时，可配置
                            enumList: [{
                                label: '', // 下拉框选项名称
                                value: '', // 下拉框选项值
                            }],

                            // comType === 'dynamicSelect' 时，可配置
                            api: '', // 动态下拉框请求接口
                        },
                        // 字段在不同动态 component 中的相关配置， 前缀对应 componentConfig 中的键值
                        // 例如： componentConfig.createForm 这里对应 createFormOption
                        // 字段在 createForm 相关配置
                        createFormConfig: {
                            ...elComponentConfig, // 继承 el-component(el-form、el-input、el-select等) 配置
                            comType: '', // 配置组件类型 'input/select/...'
                            visiable: true, // 是否展示
                            disabled: false, // 是否禁用
                            default: '', // 搜索框展示的默认值

                            // 当 comType 为 select 时，可配置
                            enumList: [{
                                label: '', // 下拉框选项名称
                                value: '', // 下拉框选项值
                            }]
                        },

                        editFormConfig: {
                            ...elComponentConfig, // 继承 el-component(el-form、el-input、el-select等) 配置
                            comType: '', // 配置组件类型 'input/select/...'
                            visiable: true, // 是否展示
                            disabled: false, // 是否禁用
                            default: '', // 搜索框展示的默认值

                            // 当 comType 为 select 时，可配置
                            enumList: [{
                                label: '', // 下拉框选项名称
                                value: '', // 下拉框选项值
                            }]
                        }
                    },

                    // table 相关配置
                    tableConfig: {
                        headerButtons: [{
                            label: '', // 按钮名称
                            eventKey: '', // 按钮事件名
                            eventOption: {}, // 按钮事件配置
                            ...elButtonConfig, // 标准 el-button 配置
                        }, ...],
                        rowButtons: [{
                            label: '', // 按钮名称
                            eventKey: '', // 按钮事件名
                            eventOption: {}, // 按钮事件配置
                            // 当 eventKey === 'remove'
                            params: {
                                // paramKey = 参数的键值
                                // rowValueKey = 表格行数据中参数对应的键值 (当格式为 schema:: tableKey时， 从table 获取相应字段)
                                paramKey: rowValueKey,
                            },
                            ...elButtonConfig, // 标准 el-button 配置
                        }, ...],
                    }
                    ...
                }
            },
            // table 相关配置
            tableConfig: {
                headerButtons: [{
                    label: '', // 按钮名称
                    eventKey: '', // 按钮事件名
                    eventOption: {
                    // 按钮事件配置
                    // 当eventKey === 'showComponent'
                        comName: '', // 动态组件名称

                    }, 
                }]
            },
            searchConfig: {
                
            },
            // 动态组件相关配置
            componentConfig: {
                // create-form 表单相关配置
                createForm: {
                    title: '', // 标题
                    saveBtnText: '', // 保存按钮文本

                },
                // edit-form 表单相关配置
                editForm: {
                    mainKey: '', // 表单主键，用于唯一标识要修改的对象
                    title: '',
                    saveBtnText: '',
                }
                // 支持 用户拓展
            }


        }

    }, ...]
}