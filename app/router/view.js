module.exports = (app, router) => {

     const { view: viewController } = app.controller;

     // 用户输入 httpp://ip:port/view/xxx 能渲染对应的页面
     router.get('/view/:page', viewController.render.bind(viewController));
 
}