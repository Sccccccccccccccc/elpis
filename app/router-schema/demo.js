/**
 * 演示接口的参数校验规则
 * key 为完整请求路径，value 按 HTTP method 区分
 */

module.exports = {

    '/api/params-verify-demo': {
        post: {
            body: {
                type: 'object',
                required: ['name', 'age'],
                properties: {
                    name: {
                        type: 'string',
                        minLength: 2
                    },
                    age: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 150
                    }
                },
                additionalProperties: false
            }
        }
    }

}
