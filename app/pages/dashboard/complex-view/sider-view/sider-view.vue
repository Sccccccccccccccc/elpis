<template>
    <sider-container>
        <template #menu-content>
            <el-menu
                class="sider-menu"
                :default-active="activeKey"
                :ellipsis="false"
                @select="onMenuSelect"
            >
                <template v-for="item in menuList">
                    <!-- group -->
                    <sub-menu
                        v-if="item.subMenu && item.subMenu.length > 0"
                        :key="item.key"
                        :menu-item="item"
                    />
                    <!-- module -->
                    <el-menu-item v-else :key="item.key" :index="item.key">
                        {{ item.name }}
                    </el-menu-item>
                </template>
            </el-menu>
        </template>
        <template #main-content>
            <router-view></router-view>
        </template>
    </sider-container>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SiderContainer from '@/widget/sider-container/sider-container.vue';
import SubMenu from './complex-view/sub-menu/sub-menu.vue';
import { useMenuStore } from '@/store/menu';

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();

const activeKey = ref('');
const menuList = ref([]);

// 当前头部菜单项对应的 sider 菜单
const setMenuList = () => {
    const headerMenuItem = menuStore.findMenuItem({
        key: 'key',
        value: route.query.key,
    });
    menuList.value = headerMenuItem?.siderConfig?.menu ?? [];
};

// 侧边栏高亮：优先取路由里的 sider_key，没有则默认第一个可跳转项
const setActiveKey = () => {
    const activeItem = route.query.sider_key
        ? menuStore.findMenuItem({ key: 'key', value: route.query.sider_key })
        : menuList.value.find((item) => item.moduleType);
    activeKey.value = activeItem?.key ?? '';
};

const handleMenuSelect = (menuKey, { replace = false } = {}) => {
    const menuItem = menuStore.findMenuItem({
        key: 'key',
        value: menuKey,
    });
    if (!menuItem || !menuItem.moduleType) {
        return;
    }

    if (menuKey === route.query.sider_key) {
        return;
    }

    const { moduleType, customConfig } = menuItem;
    const pathMap = {
        iframe: '/iframe',
        schema: '/schema',
        custom: customConfig?.path,
    };

    const path = pathMap[moduleType];
    if (!path) {
        return;
    }

    const target = {
        path: `/sider${path}`,
        query: {
            key: route.query.key,
            sider_key: menuKey,
            project_key: route.query.project_key,
        },
    };

    // 默认选中是初始化行为，用 replace 避免在浏览器历史里多出一页
    (replace ? router.replace : router.push)(target);
};

const onMenuSelect = (menuKey) => {
    handleMenuSelect(menuKey);
};

// 进入 sider 模块时默认选中第一个菜单，避免内容区空白
const selectDefaultMenu = () => {
    if (route.query.sider_key) {
        return;
    }

    const firstItem = menuList.value.find((item) => item.moduleType);
    if (firstItem) {
        handleMenuSelect(firstItem.key, { replace: true });
    }
};

const initSider = () => {
    setMenuList();
    setActiveKey();
    selectDefaultMenu();
};

watch(() => route.query.key, initSider);
watch(() => menuStore.menuList, initSider);
watch(() => route.query.sider_key, setActiveKey);

onMounted(initSider);
</script>

<style lang="less" scoped>
/**
 * 侧边栏菜单
 * 只覆盖 el-menu 的外观，颜色使用 Element Plus 的变量，深色模式自动适配。
 */
.sider-menu {
    /* 菜单本身透明，背景交给外层的 sider-container__aside */
    --el-menu-bg-color: transparent;
    --el-menu-border-color: transparent;
    --el-menu-text-color: var(--el-text-color-regular, #606266);
    --el-menu-active-color: var(--el-color-primary, #409eff);
    --el-menu-hover-bg-color: var(--el-fill-color-light, #f5f7fa);
    --el-menu-item-height: 42px;
    --el-menu-item-font-size: 14px;
    --el-menu-base-level-padding: 12px;
    --el-menu-level-padding: 16px;

    width: 100%;
    padding: 8px;
    border-right: none;
    box-sizing: border-box;
}

/* 菜单项 / 分组标题：圆角胶囊，和 aside 的圆角呼应 */
.sider-menu :deep(.el-menu-item),
.sider-menu :deep(.el-sub-menu__title) {
    margin: 2px 0;
    border-radius: 8px;
}

/* 未选中项的 hover：文字同样变为主色 */
.sider-menu :deep(.el-menu-item:not(.is-active):hover),
.sider-menu :deep(.el-sub-menu__title:hover) {
    color: var(--el-color-primary, #409eff);
}

/* 选中项：主色浅底 + 左侧主色竖条 */
.sider-menu :deep(.el-menu-item.is-active) {
    position: relative;
    color: var(--el-color-primary, #409eff);
    font-weight: 500;
    background: var(--el-color-primary-light-9, #ecf5ff);
}

.sider-menu :deep(.el-menu-item.is-active::before) {
    content: '';
    position: absolute;
    top: 50%;
    left: 4px;
    width: 3px;
    height: 16px;
    border-radius: 2px;
    background: var(--el-color-primary, #409eff);
    transform: translateY(-50%);
}

.sider-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: var(--el-color-primary, #409eff);
}
</style>
