const assert = require('assert'); // 引入断言库
const superTest = require('supertest');
const md5 = require('md5');
const elpisCore = require('../../elpis-core');

const signKey = 'djasiodajdalsjifpasdjoas'
const st = Date.now();

describe('-------project 相关接口测试', () => {
    this.timeout = 60000;

    let request;

    it('初始化', async() => {
        const app = await elpisCore.start();
        request = superTest(app.listen());
    })

    it('GET /api/project/model_list', async () => {
        let tmpRequest = request.get('/api/project/model_list').query({ project_key: 'business' });
        tmpRequest = tmpRequest.set('s_t', st);
        tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));

        const res = await tmpRequest;
        console.log(JSON.stringify(res.body));
        assert(res.body.success === true);

        const resData = res.body.data;
        assert(resData.length > 0);

        for (let i = 0; i < resData.length; i++) {
            const item = resData[i];
            assert(item.model);
            assert(item.model.desc);
            assert(item.model.name);
            assert(item.project);

            for( const projKey in item.project) {
                assert(item.project[projKey].key);
                assert(item.project[projKey].name);
            }

        }
        
    })
})