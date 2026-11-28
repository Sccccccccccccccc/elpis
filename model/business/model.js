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
                            },
                            editFormOption: {
                                comType: 'input',
                                disabled: true,
                            },
                            detailPannelOption: {
                                comType: 'input',
                            }
                        },
                        product_name: {
                            type: 'string',
                            title: '商品名称',
                            tableOption: {
                                width: 200,
                                'show-overflow-tooltip': true
                            },
                            searchOption: {
                                comType: 'input',
                            },
                            createFormOption: {
                                comType: 'input',
                                default: '114514',
                            },
                            editFormOption: {
                                comType: 'input',
                            },
                            detailPannelOption: {
                                comType: 'input',
                            }
                        },
                        price: {
                            type: 'number',
                            title: '价格',
                            tableOption: {
                                width: 200,
                            },
                            searchOption: {
                                comType: 'dynamicSelect',
                                api: '/api/project/product_enum/list'
                            },
                            createFormOption: {
                                comType: 'inputNumber',
                            },
                            editFormOption: {
                                comType: 'inputNumber',
                            },
                            detailPannelOption: {
                                comType: 'inputNumber',
                            }
                        },
                        inventory: {
                            type: 'number',
                            title: '库存',
                            tableOption: {
                                width: 200,
                            },
                            createFormOption: {
                                comType: 'inputNumber',
                            },
                            detailPannelOption: {
                                comType: 'inputNumber',
                            }
                        },
                        status: {
                            type: 'string',
                            title: '状态',
                            tableOption: {
                                width: 200,
                            },
                            searchOption: {
                                comType: 'select',
                                enumList: [
                                    {
                                        label: '全部',
                                        value: '-1'
                                    },
                                    {
                                        label: '上架',
                                        value: '1'
                                    },
                                    {
                                        label: '下架',
                                        value: '0'
                                    }
                                ]
                            },
                            createFormOption: {
                                comType: 'select',
                                enumList: [
                                    {
                                        label: '全部',
                                        value: '-1'
                                    },
                                    {
                                        label: '上架',
                                        value: '1'
                                    },
                                    {
                                        label: '下架',
                                        value: '0'
                                    }
                                ],
                            },
                            editFormOption: {
                                comType: 'select',
                                enumList: [
                                    {
                                        label: '全部',
                                        value: '-1'
                                    },
                                    {
                                        label: '上架',
                                        value: '1'
                                    },
                                    {
                                        label: '下架',
                                        value: '0'
                                    }
                                ],
                                visible: false, // 不可见，但依旧保持传参
                            },
                            detailPannelOption: {
                                comType: 'select',
                                enumList: [
                                    {
                                        label: '全部',
                                        value: '-1'
                                    },
                                    {
                                        label: '上架',
                                        value: '1'
                                    },
                                    {
                                        label: '下架',
                                        value: '0'
                                    }
                                ],
                            }
                        },
                        create_time: {
                            type: 'string',
                            title: '创建时间',
                            tableOption: {},
                            searchOption: {
                                comType: 'dateRange',
                            },
                            detailPannelOption: {
                                comType: 'input',
                            }
                        }
                    },
                    required: [ 'product_name' ],
                },

                tableConfig: {
                    headerButtons: [
                        {
                            label: '新增商品',
                            eventKey: 'showComponent',
                            eventOption: {
                                comName: 'createForm'
                            },
                            type: 'primary',
                            plain: true,
                        }
                    ],
                    rowButtons: [
                        {
                            label: '查看',
                            eventKey: 'showComponent',
                            type: 'primary',
                            eventOption: {
                                comName: 'detailPannel'
                            }
                        },
                        {
                            label: '修改',
                            eventKey: 'showComponent',
                            type: 'warning',
                            eventOption: {
                                comName: 'editForm',

                            }
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
                    ],
                },
                // 动态组件
                componentConfig: {
                    createForm: {
                        title: '新增商品',
                        saveBtnText: '新增商品',
                    },
                    editForm: {
                        mainKey: 'product_id',
                        title: '编辑商品',
                        saveBtnText: '保存商品',
                    },
                    detailPannel: {
                        mainKey: 'product_id',
                        title: '商品详情',
                    }
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