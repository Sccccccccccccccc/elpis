/**
 * API 参数校验中间件
 * @param {*} app 
 */

const Ajv = require('ajv');
const ajv = new Ajv();

module.exports = (app) => {

    // ajv@6 内置的是 draft-07，写成 2020-12 会报 no schema with key or ref
    const $schema = 'http://json-schema.org/draft-07/schema#';

    return async function apiParamsVerify(ctx, next) {
        
        // 只对 API 做参数校验
        if (ctx.path.indexOf('/api') < 0) {
            return await next();
        }

        const { body, query, headers } = ctx.request; 
        const { params, path, method } = ctx;

        app.logger.info(`[API ${method} ${path}] 参数校验开始]`, { body, query, params, headers });

        const schema = app.routerSchema[path]?.[method.toLowerCase()];

        if (!schema) {
            return await next();
        }

        let valid = true;

        // ajv 校验
        let validate;

        // 校验 headers
        if (valid && headers && schema.headers) {
            schema.headers.$schema = $schema;
            validate = ajv.compile(schema.headers);
            valid = validate(headers);
        }

        // 校验 body
        if (valid && body && schema.body) {
            schema.body.$schema = $schema;
            validate = ajv.compile(schema.body);
            valid = validate(body);
        }

        // 校验 query
        if (valid && query && schema.query) {
            schema.query.$schema = $schema;
            validate = ajv.compile(schema.query);
            valid = validate(query);
        }

        // 校验 params
        if (valid && params && schema.params) {
            schema.params.$schema = $schema;
            validate = ajv.compile(schema.params);
            valid = validate(params);
        }

        if (!valid) {
            ctx.status = 200;
            ctx.body = {
                success: false,
                message: '参数校验失败',
                code: 442,
            }
            return;
        }

        
        await next();
    }

}