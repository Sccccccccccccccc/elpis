const Koa = require('koa')

// 创建KOA实例
const app = new Koa();

// 启动服务

try {
    const port = 3000 || process.env.PORT;
    const host = '0.0.0.0' || process.env.HOST;

    app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
    })
} catch (error) {
    console.log(error);
}
 