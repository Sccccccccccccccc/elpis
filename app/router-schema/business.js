module.exports = {

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