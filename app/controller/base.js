module.exports = (app) => class BaseController {


    /**
     * controller基类
     * 统一收拢 controller 的公共方法
     */

    constructor() {
        this.app = app;
        this.config = app.config;
        this.service = app.service;
    }

    /**
     * API 处理成功时返回的统一结构
     * @param {*} ctx 上下文
     * @param {*} data  返回的数据
     * @param {*} metadata 附加数据
     */
    success(ctx, data = {}, metadata={}){
        ctx.status = 200;
        ctx.body = {
            success: true,
            data,
            metadata
        }
    }

    /**
     * API 失败处理
     * @param {*} ctx 上下文
     * @param {*} code 错误码
     * @param {*} message 错误信息
     * @param {*} metadata 附加数据
     */
    fail(ctx, code, message, metadata={}){
        ctx.status = 200;
        ctx.body = {
            success: false,
            message,
            code,
        }
    }

}