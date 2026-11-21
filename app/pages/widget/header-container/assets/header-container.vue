<!-- 通用全局头部菜单 -->
<template>
    <el-container class="header-container">
        <el-header class="header">
            <el-row class="header-row" type="flex" align="middle">

                <!-- 左上角title -->
                <el-row class="title-panel" type="flex" align="middle">
                    <img class="logo" src="../../../../public/static/icon.png" alt="">
                    <el-row class="title-panel__text"> {{ title }} </el-row>
                </el-row>

                <!-- 插槽：菜单区域 -->
                <slot name="menu-content"></slot>

                <!-- 右上方区域 -->
                <el-row class="setting-panel" type="flex" align="middle" justify="end">
                    <!-- 插槽: 设置区域 -->
                    <slot name="setting-content"></slot>
                    <img class="avatar" src="../../../../public/static/icon.png" alt="">
                    <el-dropdown @commadn="handleUserCommand">
                        <span class="el-dropdown-link">
                            {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-item command="" @click="">退出登录</el-dropdown-item>
                        </template>
                    </el-dropdown>
                </el-row>

            </el-row>
        </el-header>
        <el-main class="main-container">
            <!-- 插槽: 核心内容填充区域 -->
            <slot name="main-content"></slot>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    title: {
        type: String,
        default: '标题'
    },
})

const username = ref('admin')

const handleUserCommand = (event) => {
    console.log('handleUserCommand', event);
    
}

</script>

<style lang="less" scoped>
    /**
     * 全局头部布局
     * 颜色统一走 Element Plus 的 CSS 变量（--el-*），
     * 因此 html.dark 下会自动切换深色，无需重复写一套暗色样式。
     */

    /* entry.tpl 里给演示页留的 24px padding 会让头部无法通栏，这里清掉 */
    :global(html body) {
        padding: 0;
    }

    .header-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-width: 1000px;
        overflow: hidden;
        background: var(--el-bg-color-page, #f5f7fa);

        /* 顶栏 */
        .header {
            position: relative;
            z-index: 10;
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            height: 60px;
            padding: 0;
            background: var(--el-bg-color, #ffffff);
            border-bottom: 1px solid var(--el-border-color-light, #e4e7ed);
            box-shadow: 0 1px 4px rgba(0, 21, 41, 0.06);
            transition: background-color 0.3s, border-color 0.3s;

            &-row {
                flex: 1;
                height: 100%;
                padding: 0 24px;
                gap: 24px;
                flex-wrap: nowrap;
            }
        }

        /* 左上角 title */
        .title-panel {
            flex: 0 0 auto;
            gap: 10px;
            min-width: 0;
            cursor: default;
            user-select: none;

            .logo {
                width: 28px;
                height: 28px;
                margin-right: 0;
                padding: 2px;
                box-sizing: border-box;
                border-radius: 8px;
                object-fit: contain;
                background: var(--el-fill-color-light, #f5f7fa);
            }

            &__text {
                min-width: 0;
                overflow: hidden;
                color: var(--el-text-color-primary, #303133);
                font-size: 18px;
                font-weight: 600;
                line-height: 1.2;
                letter-spacing: 0.5px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        /* 右侧设置区 */
        .setting-panel {
            flex: 0 0 auto;
            margin-left: auto;
            gap: 12px;
            min-width: 0;

            .avatar {
                width: 32px;
                height: 32px;
                border: 1px solid var(--el-border-color, #dcdfe6);
                border-radius: 50%;
                object-fit: cover;
                background: var(--el-fill-color-light, #f5f7fa);
                cursor: pointer;
                transition: border-color 0.2s, box-shadow 0.2s;

                &:hover {
                    border-color: var(--el-color-primary, #409eff);
                    box-shadow: 0 0 0 3px var(--el-color-primary-light-8, #d9ecff);
                }
            }

            :deep(.el-dropdown) {
                line-height: 1;
            }

            :deep(.el-dropdown-link) {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 6px 10px;
                border-radius: 8px;
                outline: none;
                color: var(--el-text-color-regular, #606266);
                font-size: 14px;
                cursor: pointer;
                transition: color 0.2s, background-color 0.2s;

                &:hover,
                &:focus-visible {
                    color: var(--el-color-primary, #409eff);
                    background: var(--el-fill-color-light, #f5f7fa);
                }
            }
        }

        /* 内容区 */
        .main-container {
            flex: 1 1 auto;
            min-height: 0;
            padding: 24px;
            overflow: auto;
            box-sizing: border-box;
            background: var(--el-bg-color-page, #f5f7fa);
            transition: background-color 0.3s;

            &::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            &::-webkit-scrollbar-thumb {
                border-radius: 4px;
                background: var(--el-border-color, #dcdfe6);

                &:hover {
                    background: var(--el-text-color-disabled, #c0c4cc);
                }
            }
        }
    }

    /* Element Plus 的 el-header 默认带左右 padding */
    :deep(.el-header) {
        padding: 0;
    }

    /* 窄屏下收紧留白 */
    @media (max-width: 1200px) {
        .header-container {
            .header-row {
                padding: 0 16px;
                gap: 16px;
            }

            .main-container {
                padding: 16px;
            }
        }
    }
</style>