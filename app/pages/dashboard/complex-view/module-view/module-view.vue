<template>
    <!-- 根据当前菜单的 moduleType 渲染对应的视图组件 -->
    <component
        :is="viewComponent"
        v-if="viewComponent"
        :menu-item="menuItem"
    />
    <!-- custom 模块的页面由路由配置决定，交给 router-view 渲染 -->
    <router-view v-else-if="moduleType === 'custom'" />
    <el-empty
        v-else-if="menuStore.menuList.length"
        description="未找到对应的视图"
        :image-size="90"
    />
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '@/store/menu.js';

const route = useRoute();
const menuStore = useMenuStore();

// moduleType => 视图组件
const viewMap = {
    iframe: defineAsyncComponent(() => import('../iframe-view/iframe-view.vue')),
    schema: defineAsyncComponent(() => import('../schema-view/schema-view.vue')),
    sider: defineAsyncComponent(() => import('../sider-view/sider-view.vue')),
};

// 当前菜单项由路由 query.key 决定，刷新后也能还原
const menuItem = computed(() => menuStore.findMenuItem({
    key: 'key',
    value: route.query.key,
}));

const moduleType = computed(() => menuItem.value?.moduleType);

const viewComponent = computed(() => viewMap[moduleType.value]);
</script>

<style lang="less" scoped>
</style>
