/**
 * API 参数校验
 */

module.exports = {
    '/api/project': {
        get: {
            query: {
                type: 'object',
                properties: {
                    project_key: {
                        type: 'string'
                    }
                },
                required: ['project_key']
            },
        }
    },

    '/api/project/list': {
        get: {
            query: {
                type: 'object',
                properties: {
                    project_key: {
                        type: 'string'
                    }
                },
            },
        }
    },

    '/api/project/model_list': {
        get: {},
    },

    
}