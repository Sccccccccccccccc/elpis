 module.exports = (app, router) => {

    const { business: businessController } = app.controller;

    router.get('/api/project/product/list', businessController.getList.bind(businessController));
    router.get('/api/project/product_enum/list', businessController.getProductEnumList.bind(businessController))

    router.delete('/api/project/product', businessController.remove.bind(businessController));

}