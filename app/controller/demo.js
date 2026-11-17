module.exports = (app) => {

    return class DemoController {

        /**
         * api-params-verify 演示接口
         * 能走到这里说明请求体已通过 router-schema 中配置的 JSON Schema 校验
         * @param {object} ctx 上下文
         */
        async paramsVerify(ctx) {
            ctx.body = {
                success: true,
                message: '参数校验通过',
                received: ctx.request.body,
                time: new Date().toISOString()
            }
        }

    }

}
