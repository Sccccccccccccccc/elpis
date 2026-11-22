<template>
    <!-- iframe / schema：按 moduleType 直接渲染对应的视图组件 -->
    <component
        :is="viewComponent"
        v-if="viewComponent"
        :menu-item="menuItem"
    />
    <!-- sider 内部有嵌套子路由，custom 的页面由 customConfig.path 决定，都交给 router-view -->
    <router-view v-else-if="moduleType === 'sider' || moduleType === 'custom'" />
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

// moduleType => 视图组件（只有不涉及嵌套路由的模块才直接渲染）
const viewMap = {
    iframe: defineAsyncComponent(() => import('../iframe-view/iframe-view.vue')),
    schema: defineAsyncComponent(() => import('../schema-view/schema-view.vue')),
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
