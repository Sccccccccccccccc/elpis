module.exports = {
    /**
     * 遵循RESTful规范
     * 获取 GET
     * 新增 POST
     * 修改 PUT
     * 删除 DELETE
     */
    '/api/project/product/list': {
        get: {
            query: {
                type: 'object',
                properties: {
                    page: { type: 'string' },
                    size: { type: 'string' },
                    // demo：搜索条件都是可选的，有值才参与筛选
                    product_name: { type: 'string' },
                    price: { type: 'string' },
                    status: { type: 'string' },
                    create_time_start: { type: 'string' },
                    create_time_end: { type: 'string' },
                },
                required: ['page', 'size']
            },
        }
    },
    '/api/project/product': {
        get: {
            query: {
                type: 'object',
                properties: {
                    product_id: { type: 'string' },
                },
                required: ['product_id']
            },
        },
        post: {
            body: {
                type: 'object',
                properties: {
                    product_name: { type: 'string' },
                    // 价格用 input-number 提交的是数字，库存用普通 input 提交的是字符串，两种都收
                    price: { type: ['number', 'string'] },
                    status: { type: 'string' },
                    inventory: { type: ['number', 'string'] },
                },
                // 只有商品名称是必填（和 model 里 schema.required 保持一致）；
                // 其余字段没填时前端根本不会传，所以不能写进 required
                required: ['product_name']
            }
        },
        put: {
            body: {
                type: 'object',
                properties: {
                    product_id: { type: 'string' },
                    product_name: { type: 'string' },
                    price: { type: ['number', 'string'] },
                    status: { type: 'string' },
                    inventory: { type: ['number', 'string'] },
                },
                required: ['product_id', 'product_name']
            }
        },
        delete: {
            body: {
                type: 'object',
                properties: {
                    product_id: { type: 'string' },
                },
                required: ['product_id', 'product_key']
            }
        }
    },
    '/api/project/product_enum/list': {
        get: {}
    }

}