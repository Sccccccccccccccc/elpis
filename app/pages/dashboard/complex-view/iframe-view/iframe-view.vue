<template>
    <div class="iframe-view">
        <iframe
            v-if="iframeSrc"
            class="iframe-view__frame"
            :src="iframeSrc"
            :title="iframeTitle"
            allowfullscreen
        ></iframe>
        <el-empty
            v-else
            class="iframe-view__empty"
            description="未配置 iframe 地址"
            :image-size="90"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '@/store/menu';

const props = defineProps({
    menuItem: {
        type: Object,
        default: () => ({}),
    },
});

const route = useRoute();
const menuStore = useMenuStore();

/**
 * 头部菜单里的 iframe 模块由 module-view 通过 prop 传入；
 * 侧边栏里的 iframe 子模块是路由渲染的，没有 prop，需要按 sider_key / key 反查菜单配置。
 */
const currentMenuItem = computed(() => {
    if (props.menuItem?.iframeConfig?.path) {
        return props.menuItem;
    }

    const siderMenuItem = route.query.sider_key
        ? menuStore.findMenuItem({ key: 'key', value: route.query.sider_key })
        : null;

    return siderMenuItem
        || menuStore.findMenuItem({ key: 'key', value: route.query.key })
        || {};
});

const iframeSrc = computed(() => currentMenuItem.value?.iframeConfig?.path ?? '');
const iframeTitle = computed(() => currentMenuItem.value?.name ?? 'iframe');
</script>

<style lang="less" scoped>
.iframe-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 320px;
    overflow: hidden;
    border: 1px solid var(--el-border-color-lighter, #ebeef5);
    border-radius: 10px;
    background: var(--el-bg-color, #ffffff);
    box-sizing: border-box;

    &__frame {
        flex: 1 1 auto;
        width: 100%;
        min-height: 0;
        border: 0;
        background: var(--el-bg-color, #ffffff);
    }

    &__empty {
        margin: auto;
    }
}
</style>
