module.exports = {

    '/api/project/product/list': {
        get: {
            query: {
                type: 'object',
                properties: {
                    page: { type: 'string' },
                    size: { type: 'string' },
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
                required: ['product_id']
            }
        }
    }

}