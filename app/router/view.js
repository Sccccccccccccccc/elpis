module.exports = (app, router) => {

     const { view: viewController } = app.controller;

     // 用户输入 httpp://ip:port/view/xxx 能渲染对应的页面
     router.get('/view/:page', viewController.render.bind(viewController));

     // 验证 bodyParser：POST 请求体应能被解析到 ctx.request.body
     router.post('/api/body-parser', viewController.testBodyParser.bind(viewController));
 
}