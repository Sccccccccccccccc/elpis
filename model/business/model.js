/**
 * 结构详情查看 docs/dashboard-model.js
 */

module.exports = {
    model: 'dashboard',
    name: '电商系统',
    desc: '含商品、订单、客户管理的电商后台',
    menu: [
        {
            key: 'product',
            name: '商品管理',
            menuType: 'module',
            moduleType: 'schema',
            schemaConfig: {
                api: '/api/project/product',
                schema: {
                    type: 'object',
                    properties: {

                        product_id: {
                            type: 'string',
                            title: '商品ID',
                            tableOption: {
                                width: 300,
                                'show-overflow-tooltip': true
                            }
                        },
                        product_name: {
                            type: 'string',
                            title: '商品名称',
                            tableOption: {
                                width: 200,
                                'show-overflow-tooltip': true
                            }
                        },
                        price: {
                            type: 'number',
                            title: '价格',
                            tableOption: {
                                width: 200,
                            }
                        },
                        inventory: {
                            type: 'number',
                            title: '库存',
                            tableOption: {
                                width: 200,
                            }
                        },
                        // status: {
                        //     type: 'string',
                        //     title: '状态',
                        //     tableOption: {
                        //         width: 200,
                        //     }
                        // },
                        create_time: {
                            type: 'string',
                            title: '创建时间',
                            tableOption: {}
                        }

                    }
                },

                tableConfig: {
                    headerButtons: [
                        {
                            label: '新增商品',
                            eventKey: 'showComponent',
                            type: 'primary',
                            plain: true,
                        }
                    ],
                    rowButtons:[
                        {
                            label: '修改',
                            eventKey: 'showComponent',
                            type: 'warning',
                        },
                        {
                            label: '删除',
                            eventKey: 'remove',
                            type: 'danger',
                            eventOption: {
                                params: {
                                    product_id: 'schema::product_id'
                                }
                            },
                            type: 'danger',
                        }

                    ]
                }
            }
        },
        {
            key: 'order',
            name: '订单管理',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
                path: '/todo',
            }
        },
        {
            key: 'client',
            name: '客户管理',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
                path: '/todo',
            }
        },
    ]
}