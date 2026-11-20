<template>

    <header-container :title="'项目列表'">
        <template #main-content>
            <div v-loading>
                <div v-for="item in modeList" :key="item?.key">
                    
                    <!-- 展示model -->
                    <div class="model-panel">
                        <el-row type="flex" align="middle">
                            <div class="model-panel__title">
                                {{ item.model?.name }}
                            </div>
                        </el-row>
                    </div>
                    <el-row flex class="project-list">
                        <el-card class="project-card" v-for="projItem in item.project" :key="projItem.key">
                            <template #header>
                                <div class="project-card__header">
                                    <span>{{ projItem.name }}</span>
                                </div>
                            </template>
                            <div class="card-content">
                                {{ projItem.desc ?? '-' }}
                            </div>
                            <template #footer>
                                <el-row justify="end">
                                    <el-button link type="primary" @click="onEnter(projItem.key)">
                                        进入
                                    </el-button>
                                </el-row>
                            </template>
                        </el-card>
                    </el-row>
                </div>
            </div>
        </template>
    </header-container>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import curl from '@/common/curl';
import headerContainer from '@/widget/header-container/assets/header-container.vue';

const loading = ref(false);
const modeList = ref([]);

async function getModeList() {
    loading.value = true;
    const res = await curl({
        url: '/api/project/model_list',
        method: 'GET',
        errorMessage: '列表获取失败',
        query: {
            page: 1,
            size: 10,
        },
    });
    loading.value = false;

    if( !res || !res.success || !res.data ) {
        return;
    }

    modeList.value = res.data;
    console.log('modeList', modeList.value);
    
}

onMounted( () => {
    getModeList();
});

const onEnter = (projItem) => {
    console.log('onEnter', projItem);
}

</script>

<style lang="less" scoped>
/**
 * 项目列表页
 *
 * 只覆盖样式，不改动模板结构，可用的钩子：
 * - .model-panel          每个模型的分组容器
 * - .model-panel__title   模型名称
 * - .project-list         el-row，改成 Grid 卡片栅格
 * - .project-card         el-card 项目卡片
 * - .project-card__header 卡片头部（项目名）
 * - .card-content         卡片正文（项目描述）
 *
 * 颜色统一使用 Element Plus 的 CSS 变量（--el-*），
 * entry.tpl 的 html 带 dark 类，深色模式会自动切换，无需另写一套暗色样式。
 */

/* ---------- 模型分组标题 ---------- */
.model-panel {
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
}

.model-panel__title {
    position: relative;
    padding-left: 12px;
    color: var(--el-text-color-primary, #303133);
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 0.2px;

    /* 左侧主色竖条，两端用渐变收得更柔和 */
    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 3px;
        height: 16px;
        border-radius: 2px;
        background: linear-gradient(180deg, var(--el-color-primary, #409eff), var(--el-color-primary-light-3, #79bbff));
        transform: translateY(-50%);
    }
}

/* ---------- 项目卡片栅格 ---------- */
.project-list {
    display: grid; /* 覆盖 el-row 自带的 display: flex */
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin: 0 0 32px;
}

/* ---------- 项目卡片 ---------- */
.project-list .project-card {
    /* 用 el-card 自己的变量定制圆角与描边，避免和 Element Plus 默认样式打架 */
    --el-card-border-radius: 10px;
    --el-card-border-color: var(--el-border-color-lighter, #ebeef5);

    position: relative;
    overflow: hidden;
    box-shadow: none; /* 覆盖默认的 is-always-shadow，改成 hover 时才浮起 */
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        border-color: var(--el-color-primary-light-3, #79bbff);
        box-shadow: var(--el-box-shadow-light, 0 0 12px rgba(0, 0, 0, 0.12));
    }

    /* 头部换浅色底，和正文区分开 */
    :deep(.el-card__header) {
        padding: 12px 16px;
        border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
        background: var(--el-fill-color-light, #f5f7fa);
    }

    :deep(.el-card__body) {
        padding: 14px 16px;
    }

    :deep(.el-card__footer) {
        padding: 6px 16px 8px;
        border-top: 1px solid var(--el-border-color-lighter, #ebeef5);
        background: transparent;
    }
}

/* 卡片头部：主色圆点 + 项目名（超长省略） */
.project-card__header {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    color: var(--el-text-color-primary, #303133);
    font-size: 15px;
    font-weight: 600;
    line-height: 1.5;

    &::before {
        content: '';
        flex: 0 0 6px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--el-color-primary, #409eff);
    }

    span {
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

/* 卡片正文：描述最多两行，并保持统一高度 */
.card-content {
    display: -webkit-box;
    min-height: 42px;
    overflow: hidden;
    color: var(--el-text-color-secondary, #909399);
    font-size: 13px;
    line-height: 1.6;
    word-break: break-word;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

/* 底部「进入」按钮：收紧留白，补一个 hover 会右移的箭头 */
.project-list :deep(.el-card__footer .el-button) {
    padding: 2px 0;
    font-size: 13px;
    font-weight: 500;
}

.project-list :deep(.el-card__footer .el-button::after) {
    content: '→';
    margin-left: 2px;
    transition: transform 0.2s ease;
}

.project-list :deep(.el-card__footer .el-button:hover::after) {
    transform: translateX(2px);
}

/* ---------- 窄屏适配 ----------
 * 外层 header-container 设置了 min-width: 1000px，
 * 这里主要处理 1000~1280 之间卡片密度的变化。
 */
@media (max-width: 1280px) {
    .project-list {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 12px;
        margin-bottom: 28px;
    }

    .model-panel {
        margin-bottom: 14px;
    }
}

/* ---------- 动效降级 ---------- */
@media (prefers-reduced-motion: reduce) {
    .project-list .project-card,
    .project-list :deep(.el-card__footer .el-button::after) {
        transition: none;
    }

    .project-list .project-card:hover {
        transform: none;
    }

    .project-list :deep(.el-card__footer .el-button:hover::after) {
        transform: none;
    }
}
</style>