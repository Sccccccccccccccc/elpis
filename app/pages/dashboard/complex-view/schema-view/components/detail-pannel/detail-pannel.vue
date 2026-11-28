<template>
    <el-drawer
        v-model="isShow"
        direction="rtl"
        :destroy-on-close="true"
        :size="550"
        class="detail-pannel"
    >
        <template #header>
            <h3>{{ title }}</h3>
        </template>
        <template #default>
            <el-descriptions
                v-loading="loading"
                class="detail-pannel__content"
                :column="column"
                border
            >
                <el-descriptions-item
                    v-for="item in detailItems"
                    :key="item.key"
                    :label="item.label"
                >
                    <span :class="{ 'detail-pannel__empty': item.isEmpty }">
                        {{ item.value }}
                    </span>
                </el-descriptions-item>
            </el-descriptions>
        </template>
        <template #footer>
            <el-button class="detail-pannel__close" @click="close">关闭</el-button>
        </template>
    </el-drawer>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import curl from '@/common/curl';

const {
    api,
    components
} = inject('schemaViewData');

const name = ref('detailPannel');
const isShow = ref(false);
const loading = ref(false);
const title = ref('');
const column = ref(1);
const mainKey = ref('');
const mainValue = ref('');
const detailData = ref({});

// detailPannel 的 schema：由 model 里每个字段的 detailPannelOption 构建
const detailSchema = computed(() => components.value?.[name.value]?.schema);

const getValueText = (itemSchema, value) => {
    if (value === undefined || value === null || value === '') {
        return '-';
    }

    const { option = {} } = itemSchema;
    const { comType, enumList } = option;

    // select 存的是 value，展示要换成 label
    if (comType === 'select' && Array.isArray(enumList)) {
        const enumItem = enumList.find(item => String(item.value) === String(value));
        return enumItem?.label ?? String(value);
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

const detailItems = computed(() => {
    const properties = detailSchema.value?.properties ?? {};

    return Object.keys(properties)
        .filter((key) => {
            const { option = {} } = properties[key];
            return option.visiable !== false && option.visible !== false;
        })
        .map((key) => {
            const itemSchema = properties[key];

            return {
                key,
                label: itemSchema.label ?? itemSchema.title ?? key,
                value: getValueText(itemSchema, detailData.value?.[key]),
                isEmpty: detailData.value?.[key] === undefined
                    || detailData.value?.[key] === null
                    || detailData.value?.[key] === '',
            };
        });
});

const show = (rowData) => {
    const config = components.value?.[name.value]?.config ?? {};

    title.value = config.title ?? '详情';
    column.value = config.column ?? 1;
    mainKey.value = config.mainKey ?? '';
    mainValue.value = mainKey.value ? rowData?.[mainKey.value] : undefined;

    // 先用表格行数据渲染，抽屉打开就有内容；详情接口回来后再覆盖
    detailData.value = { ...(rowData ?? {}) };
    isShow.value = true;

    fetchDetailData();
}

const close = () => {
    isShow.value = false;
}

const fetchDetailData = async () => {
    if (loading.value || !mainKey.value || mainValue.value === undefined) {
        return;
    }

    loading.value = true;

    try {
        const res = await curl({
            method: 'GET',
            url: api.value,
            query: {
                [mainKey.value]: mainValue.value
            }
        });

        if (!res || !res.success || !res.data) {
            return;
        }

        detailData.value = { ...res.data };
    } finally {
        loading.value = false;
    }
}

defineExpose({
    name,
    show
})

</script>

<style lang="less" scoped>
/* 抽屉是 teleport 出去的，样式不要嵌在某个类下面，直接按元素/类名写 */
:deep(.el-descriptions__label) {
    width: 110px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    white-space: nowrap;
}

.detail-pannel__content {
    margin-top: 4px;
}

.detail-pannel__empty {
    color: var(--el-text-color-placeholder);
}

.detail-pannel__close {
    width: 100%;
}

h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}
</style>
