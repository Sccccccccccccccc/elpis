module.exports = (app) => {
    const baseController = require('./base')(app)
    return class BusinessController extends baseController {
        getList(ctx) {
            const { page, size } = ctx.request.body

            // 获取 project_key
            // 根据不同的 key 做不一样的数据提取

            const { project_key } = ctx.request.body

            this.success(ctx, [{
                product_id: '1',
                product_name: `${ctx.request.header.project_key}苹果`,
                price: 39.9,
                inventory: 99999,
                create_time: '2020-01-01 00:00:00',
            }, {
                product_id: '2',
                product_name: '香蕉',
                price: 19.9,
                inventory: 99999,
                create_time: '2020-01-01 00:00:00',
            },{
                product_id: '3',
                product_name: '橙子',
                price: 29.9,
                inventory: 99999,
                create_time: '2020-01-01 00:00:00',
            }],
            // metaData 额外参数
            {
                total: 3,
                page,
                size
            })
        }

        remove(ctx) {
            const { product_id } = ctx.request.body
            this.success(ctx, {
                project_key: ctx.request.header.project_key,
                product_id: product_id
            });
        }
    }
}