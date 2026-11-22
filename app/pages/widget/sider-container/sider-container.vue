<template>
    <el-container class="sider-container">
        <el-aside class="sider-container__aside" width="200px">
            <slot name="menu-content">

            </slot>
        </el-aside>
        <el-main class="sider-container__main">
            <slot name="main-content">

            </slot>
        </el-main>
    </el-container>
</template>

<script setup>
</script>

<style lang="less" scoped>
/**
 * 侧边栏布局
 * 颜色统一使用 Element Plus 的 CSS 变量（--el-*），深色模式自动适配。
 */
.sider-container {
    display: flex;
    gap: 16px;
    height: 100%;
    min-height: 420px;

    &__aside {
        flex: 0 0 200px;
        width: 200px;
        overflow-y: auto;
        border: 1px solid var(--el-border-color-lighter, #ebeef5);
        border-radius: 12px;
        background: var(--el-bg-color-overlay, #ffffff);
        box-sizing: border-box;

        /* 菜单过长时给一个细滚动条，避免挤压菜单项 */
        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background: var(--el-border-color, #dcdfe6);

            &:hover {
                background: var(--el-text-color-disabled, #c0c4cc);
            }
        }
    }

    &__main {
        flex: 1 1 auto;
        min-width: 0;
        min-height: 0;
        height: 100%;
        padding: 0;
        overflow: auto;
        background: transparent;
    }
}
</style>
