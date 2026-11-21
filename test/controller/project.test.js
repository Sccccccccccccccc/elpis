const assert = require('assert'); // 引入断言库
const superTest = require('supertest');
const md5 = require('md5');
const elpisCore = require('../../elpis-core');

const signKey = 'djasiodajdalsjifpasdjoas'
const st = Date.now();

describe('-------project 相关接口测试', () => {
    this.timeout = 60000;

    let modelList;
    let request;
    let projectList = [];

    it('初始化', async () => {
        const app = await elpisCore.start();

        modelList = require('../../model/index.js')(app);
        modelList.forEach(modelItem => {
            const { project } = modelItem;
            for (const key in project) {
                projectList.push(project[key]);
            }
        });

        request = superTest(app.listen());
    })

    // it('GET /api/project wthout project_key', async () => {

    //     let tmpRequest = request.get('/api/project');
    //     tmpRequest = tmpRequest.set('s_t', st);
    //     tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));

    //     const res = await tmpRequest;
    //     assert(res.body.success === false);

    //     const resData = res.body;
    //     console.log('resDataresDataresDataresData', res.body);

    //     assert( resData.code === 442);
    //     assert( resData.message.indexOf('参数校验失败') > -1);

    // })

    it('GET /api/project with project_key', async () => {

        for (let i = 0; i < projectList.length; i++) {
            const projectItem = projectList[i];
            const { key: project_key } = projectItem;
            let tmpRequest = request.get('/api/project');
            tmpRequest = tmpRequest.set('s_t', st);
            tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));
            tmpRequest = tmpRequest.query({ 'project_key': project_key });

            const res = await tmpRequest;
            assert(res.body.success === true);

            const resData = res.body.data;
            assert(resData.key === project_key);
            assert(resData.modelKey);
            assert(resData.name);
            assert(resData.desc != undefined);
            assert(resData.homePage != undefined);

            const { menu } = resData;
            menu.forEach(menuItem => {
                checkMenuItem(menuItem);
            });

        }

        // 校验 menu菜单项
        function checkMenuItem(menuItem) {            
            assert(menuItem.key);
            assert(menuItem.name);
            assert(menuItem.menuType);

            if (menuItem.menuType === 'group') {
                assert(menuItem.subMenu !== undefined);
                menuItem.subMenu.forEach(subMenuItem => {
                    checkMenuItem(subMenuItem)
                })
            }
            if (menuItem.menuType === 'module') {
                checkModule(menuItem);
            }
        }

        function checkModule(moduleItem) {
            const { moduleType } = moduleItem;
            assert(moduleType);

            if (moduleType === 'sider') {

                const { siderConfig } = moduleItem;
                assert(siderConfig);
                assert(siderConfig.menu);
                siderConfig.menu.forEach(siderMenuItem => {
                    checkMenuItem(siderMenuItem);
                })

            }
            if (moduleType === 'custom') {
                const { customConfig } = moduleItem;
                assert(customConfig);
                assert(customConfig.path !== undefined);
            }
            if (moduleType === 'iframe') {
                const { iframeConfig } = moduleItem;
                assert(iframeConfig);
                assert(iframeConfig.path !== undefined);
            }
            if (moduleType === 'schema') {
                const { schemaConfig } = moduleItem;
                assert(schemaConfig);
                assert(schemaConfig.api !== undefined);
                assert(schemaConfig.schema !== undefined);
            }
        }

    });

    // it('POST /api/project fail', async () => {
    //     let tmpRequest = request.get('/api/project');
    //     tmpRequest = tmpRequest.set('s_t', st);
    //     tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));
    //     tmpRequest = tmpRequest.query({project_key: 'nonexist_project_key'});

    //     const res = await tmpRequest;
    //     assert(res.body.success === false);

    //     const resData = res.body;
    //     console.log('resDataresDataresDataresData', res.body);

    //     assert( resData.code === 50000 );
    //     assert( resData.message.indexOf('获取项目异常') > -1);
    // })

    // it('GET /api/project/list without project_key', async () => {

    //     let tmpRequest = request.get('/api/project/list');
    //     tmpRequest = tmpRequest.set('s_t', st);
    //     tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));

    //     const res = await tmpRequest;
    //     assert(res.body.success === true );

    //     const resData = res.body.data;
    //     assert(resData.length === projectList.length);

    //     for( let i = 0; i < resData.length; i++ ) {
    //         // modelKey, key, name, desc, homePage
    //         const item = resData[i];
    //         assert(item.modelKey);
    //         assert(item.key);
    //         assert(item.name);
    //         assert(item.desc != undefined);
    //         assert(item.homePage != undefined);
    //     }

    // })

    // it('GET /api/project/list with project_key', async () => {
    //     // 随机选择一个 project_key（项目 key，例如 pdd / taobao）
    //     const picked = projectList[Math.floor(Math.random() * projectList.length)];
    //     const { key: projKey, modelKey } = picked;

    //     let tmpRequest = request.get('/api/project/list');
    //     tmpRequest = tmpRequest.set('s_t', st);
    //     tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));
    //     tmpRequest = tmpRequest.query({ project_key: projKey });

    //     const res = await tmpRequest;
    //     assert(res.body.success === true );

    //     const resData = res.body.data;
    //     // 接口语义：用项目 key 定位它所属的模型，返回该模型下的全部项目
    //     const expectedList = projectList.filter(item => item.modelKey === modelKey);

    //     assert(resData.length === expectedList.length);
    //     // 两个模型的项目数量可能相同，必须再校验返回项的 modelKey 和 key 集合
    //     assert(resData.every(item => item.modelKey === modelKey));
    //     assert.deepStrictEqual(
    //         resData.map(item => item.key).sort(),
    //         expectedList.map(item => item.key).sort()
    //     );

    //     for( let i = 0; i < resData.length; i++ ) {
    //         // modelKey, key, name, desc, homePage
    //         const item = resData[i];
    //         assert(item.modelKey);
    //         assert(item.key);
    //         assert(item.name);
    //         assert(item.desc != undefined);
    //         assert(item.homePage != undefined);
    //     }

    // })

    // it('GET /api/project/model_list', async () => {
    //     let tmpRequest = request.get('/api/project/model_list').query({ project_key: 'business' });
    //     tmpRequest = tmpRequest.set('s_t', st);
    //     tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));

    //     const res = await tmpRequest;
    //     assert(res.body.success === true);

    //     const resData = res.body.data;
    //     assert(resData.length > 0);

    //     for (let i = 0; i < resData.length; i++) {
    //         const item = resData[i];
    //         assert(item.model);
    //         assert(item.model.desc);
    //         assert(item.model.name);
    //         assert(item.project);

    //         for( const projKey in item.project) {
    //             assert(item.project[projKey].key);
    //             assert(item.project[projKey].name);
    //         }

    //     }

    // })
})