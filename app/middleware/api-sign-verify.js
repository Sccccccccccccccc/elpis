/**
 * API 签名验证中间件
 * @param {[object]} app koa 实例 
 */

const md5 = require('md5');

module.exports = (app) => {

    console.log('api sign verify middleware loaded');

    const signKey = 'djasiodajdalsjifpasdjoas';

    // 页面演示接口不参与签名，便于单独验证 bodyParser / api-params-verify
    const signWhitelist = ['/api/body-parser', '/api/params-verify-demo'];

    return async function apiSignVerify(ctx, next) {
        // 只对 api 请求做签名校验，页面/静态资源等其他请求直接放行
        if (!ctx.path.startsWith('/api') || signWhitelist.includes(ctx.path)) {
            return await next();
        }

        const { path, method } = ctx;
        const { headers } = ctx.request;
        const { s_sign: sSign, s_t: st } = headers;

        const signature = md5(`${signKey}_${st}`);
        app.logger.info(`[${method} ${path}] signature: ${signature}`);

        const stNumber = Number(st);
        // 时间戳缺失/非法，或与当前时间偏差超过 60 秒，都视为过期
        const expired = !st
            || !Number.isFinite(stNumber)
            || Math.abs(Date.now() - stNumber) > 60000;

        if (!sSign || expired || signature !== String(sSign).toLowerCase()) {
            ctx.status = 200;
            ctx.body = {
                success: false,
                message: '签名错误',
                code: 445
            }
            return;
        }

        await next();


    }


}