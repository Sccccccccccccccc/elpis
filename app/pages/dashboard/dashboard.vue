<template>
    <el-config-provide :locale="zhCn">
        <header-view :projectName="projectName" @menu-select="onMenuSelect">
            <template #main-content>
                <module-view></module-view>
            </template>
        </header-view>
    </el-config-provide>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import curl from '@/common/curl.js';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import HeaderView from './complex-view/header-view/header-view.vue';
import ModuleView from './complex-view/module-view/module-view.vue';
import { useMenuStore } from '@/store/menu.js';
import { useProjectStore } from '@/store/project.js';

const router = useRouter();
const route = useRoute();

const menuStore = useMenuStore();
const projectStore = useProjectStore();

const projectName = ref('');

// 请求 /api/project/list 接口, 并缓存到 project-store 中
async function getProjectList() {
    const res = await curl({
        method: 'get',
        url: '/api/project/list',
        query: {
            project_key: route.query.project_key
        }
    });
    if( !res || !res.success || !res.data ) return;

    projectStore.setProjectList(res.data);
}

// 请求 /api/project 接口, 并缓存到 menu-store 中
async function getProjectConfig() {
    const res = await curl({
        method: 'get',
        url: '/api/project',
        query: {
            project_key: route.query.project_key
        }
    })
    if( !res || !res.success || !res.data ) return;

    const { name, menu } = res.data;
    projectName.value = name;
    menuStore.setMenuList(menu);
}

// 点击头部菜单回调：根据 moduleType 跳转到对应的视图路由
const onMenuSelect = (menuItem) => {
    console.log('onMenuSelect', menuItem);
    
    if (!menuItem) return;

    const { menuType, moduleType, key, customConfig } = menuItem;

    // 分组菜单只负责展开子菜单，本身不跳转
    if (menuType === 'group' || !moduleType) return;

    // 已经是当前页面，不重复跳转
    if (key === route.query.key) return;

    const pathMap = {
        sider: '/sider',
        iframe: '/iframe',
        schema: '/schema',
        custom: customConfig?.path
    }

    const path = pathMap[moduleType];

    // 未匹配到路由（例如 custom 没有配置 path）时不做跳转
    if (!path) return;

    router.push({
        path,
        query: {
            key,
            project_key: route.query.project_key
        }
    })
}

onMounted(() => {
    getProjectList();
    getProjectConfig();
});
</script>

<style lang="less" scoped>

</style>