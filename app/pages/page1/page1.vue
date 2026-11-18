<template>
    <h1>page1！5！</h1>
    <el-input v-model="content" style="width: 200px" ></el-input> 
    <div>{{ content }}</div>

    <section class="curl-test">
        <h2>curl.js 测试</h2>
        <el-button type="primary" :loading="loading" @click="testCurlSuccess">
            测试 GET /api/project/list
        </el-button>
        <el-button :loading="loading" @click="testCurlFail">
            测试参数校验失败（442）
        </el-button>
        <pre class="curl-result">{{ curlResult }}</pre>
    </section>
</template>

<script setup>

import { ref } from 'vue';
// import utils from '@/common/util.js';
import curl from '@/common/curl.js';

const content = ref('');
const curlResult = ref('尚未测试');
const loading = ref(false);

const runCurl = async (options) => {
    loading.value = true;
    curlResult.value = '请求中...';

    try {
        const res = await curl(options);
        curlResult.value = JSON.stringify(res, null, 2);
    } catch (err) {
        curlResult.value = `请求异常：${err.message}`;
    } finally {
        loading.value = false;
    }
};

// 成功场景：带 query 的 GET，curl 会自动加 s_t / s_sign 签名
const testCurlSuccess = () => runCurl({
    url: '/api/project/list',
    method: 'GET',
    query: {
        project_key: 'test'
    }
});

// 失败场景：body 不符合 router-schema，后端返回 code 442
const testCurlFail = () => runCurl({
    url: '/api/params-verify-demo',
    method: 'POST',
    data: {
        name: 'e',
        age: -1
    }
});

</script>

<style lang="less" scoped>

h1 {
    color: cadetblue;
}

.curl-test {
    margin-top: 24px;

    h2 {
        font-size: 18px;
    }
}

.curl-result {
    margin-top: 12px;
    padding: 12px;
    min-height: 40px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 12px;
}

</style>
