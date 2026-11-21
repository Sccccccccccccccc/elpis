<template>
    <el-config-provide :locale="zh-cn">
        <headerView :projectName="projectName" />
    </el-config-provide>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import curl from '@/common/curl.js';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import headerView from './complex-view/header-view/header-view.vue';
import { useMenuStore } from '@/store/menu.js';
import { useProjectStore } from '@/store/project.js';

const menuStore = useMenuStore();
const projectStore = useProjectStore();

const projectName = ref('');

// 请求 /api/project/list 接口, 并缓存到 project-store 中
async function getProjectList() {
    const res = await curl({
        method: 'get',
        url: '/api/project/list',
        query: {
            project_key: 'pdd'
        }
    });
    if( !res || !res.success || !res.data ) return;

    console.log('getProjectList', res.data);
    projectStore.setProjectList(res.data);
}

// 请求 /api/project 接口, 并缓存到 menu-store 中
async function getProjectConfig() {
    const res = await curl({
        method: 'get',
        url: '/api/project',
        query: {
            project_key: 'pdd'
        }
    })
    if( !res || !res.success || !res.data ) return;

    console.log('getProject', res.data);

    const { name, menu } = res.data;
    projectName.value = name;
    menuStore.setMenuList(menu);
}


onMounted(() => {
    getProjectList();
    getProjectConfig();
});
</script>

<style lang="less" scoped>

</style>