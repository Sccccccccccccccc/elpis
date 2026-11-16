module.exports = (app, router) => {

     const { view: viewController } = app.controller;

     // 用户输入 httpp://ip:port/view/xxx 能渲染对应的页面
     router.get('/view/:page', viewController.render.bind(viewController));

     // 验证 bodyParser：POST 请求体应能被解析到 ctx.request.body
     // 放在 /api 之外，避免被 api-sign-verify 的签名校验拦截
     router.post('/api/body-parser', viewController.testBodyParser.bind(viewController));
 
}