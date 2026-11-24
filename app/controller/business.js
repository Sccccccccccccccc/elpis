module.exports = (app) => {
    const baseController = require('./base')(app)
    return class BusinessController extends baseController {
        getList(ctx) {
            // GET 请求的参数在 query 上（原来的 ctx.request.body 是空的）
            const {
                page = '1',
                size = '10',
                product_name: productName,
                price,
                status,
                create_time_start: createTimeStart,
                create_time_end: createTimeEnd,
            } = ctx.request.query;

            // demo 数据：字段和 model/business/model.js 里的 schema 对齐
            const listData = [{
                product_id: '1',
                product_name: `${ctx.request.header.project_key}苹果`,
                price: 39.9,
                inventory: 99999,
                status: '1',
                create_time: '2020-01-01 10:00:00',
            }, {
                product_id: '2',
                product_name: '香蕉',
                price: 19.9,
                inventory: 88888,
                status: '0',
                create_time: '2020-02-02 10:00:00',
            }, {
                product_id: '3',
                product_name: '橙子',
                price: 29.9,
                inventory: 77777,
                status: '1',
                create_time: '2020-03-03 10:00:00',
            }];

            // demo 筛选：参数有值才生效，没传就是全量
            const filterList = listData.filter((item) => {
                if (productName && !item.product_name.includes(productName)) {
                    return false;
                }

                // 价格下拉是精确匹配（query 里拿到的是字符串，转数字比）
                if (price !== undefined && price !== '' && Number(item.price) !== Number(price)) {
                    return false;
                }

                // 状态传 -1 表示“全部”
                if (status !== undefined && status !== '' && status !== '-1' && item.status !== status) {
                    return false;
                }

                // 日期区间：前端传 'YYYY-MM-DD'，按天比较即可
                const createDate = item.create_time.slice(0, 10);

                if (createTimeStart && createDate < createTimeStart) {
                    return false;
                }

                if (createTimeEnd && createDate > createTimeEnd) {
                    return false;
                }

                return true;
            });

            // demo 分页：先筛后切
            const pageNum = Number(page) || 1;
            const pageSize = Number(size) || 10;
            const offset = (pageNum - 1) * pageSize;

            this.success(ctx, filterList.slice(offset, offset + pageSize),
                // metaData 额外参数
                {
                    total: filterList.length,
                    page: pageNum,
                    size: pageSize
                })
        }

        remove(ctx) {
            const { product_id } = ctx.request.body
            this.success(ctx, {
                project_key: ctx.request.header.project_key,
                product_id: product_id
            });
        }

        getProductEnumList(ctx) {
            this.success(ctx, [{
                label: '39.9',
                value: 39.9,
            }, {
                label: '19.9',
                value: 19.9,
            }, {
                label: '29.9',
                value: 29.9,
            }])
        }
    }
}