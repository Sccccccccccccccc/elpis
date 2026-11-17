module.exports = (app, router) => {

    const { demo: demoController } = app.controller;

    // 演示 api-params-verify：请求体需符合 app/router-schema/demo.js 中的规则
    router.post('/api/params-verify-demo', demoController.paramsVerify.bind(demoController));

}
