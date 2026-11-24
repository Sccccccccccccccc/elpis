<template>
    <div class="schema-table">
        <el-table
            v-if="tableColumns.length"
            v-loading="loading"
            :data="tableData"
            class="schema-table__table"
        >
            <!-- 根据 schema.properties 生成列，列配置来自 option（即 tableOption） -->
            <el-table-column
                v-for="column in tableColumns"
                :key="column.key"
                :prop="column.key"
                :label="column.label"
                v-bind="column.props"
            ></el-table-column>

            <!-- 行操作按钮 -->
            <el-table-column
                v-if="buttons?.length"
                label="操作"
                fixed="right"
                :width="operationWidth"
            >
                <template #default="scope">
                    <el-button
                        v-for="item in buttons"
                        :key="item.eventKey || item.label"
                        link
                        v-bind="getButtonProps(item)"
                        @click="operationHandler({ btnConfig: item, rowData: scope.row })"
                    >
                        {{ item.label }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row
            v-if="tableColumns.length"
            class="schema-table__pagination"
            justify="end"
        >
            <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="onPageSizeChange"
                @current-change="onCurrentChange"
            />
        </el-row>
    </div>
</template>

<script setup>
import { ref, toRefs, computed, watch, nextTick } from 'vue'
import curl from '@/common/curl';

const props = defineProps({
    /**
     * schema 表格配置, 结构参考 doc/dashboard.js
     * schema: {
                type: 'object',
                properties: {
                    key: {
                        ...schema, // 标准 schema 配置
                        label: '', // 字段的中文名（也兼容 title）
                        type: '', // 字段类型
                        option: { // 由 tableOption 转换而来
                            ...elTableColumnConfig,
                            visiable: true, // 是否在表格中显示，false 时隐藏
                            toFixed: 2, // 数字保留几位小数
                        },
                    },
                    ...
                }
            },
     */
    schema: {
        type: Object,
        default: () => ({}),
    },

    /**
     * 表格数据源 api，请求路径为 `${api}/list`
     */
    api: {
        type: String,
        default: '',
    },

    /**
     * buttons 操作按钮相关配置
     * [{
            label: '', // 按钮名称
            eventKey: '', // 按钮事件名
            eventOption: {}, // 按钮事件配置
            ...elButtonConfig, // 标准 el-button 配置
        }, ...]
     */
    buttons: {
        type: Array,
        default: () => [],
    },
});

const { schema, api, buttons } = toRefs(props);
const emit = defineEmits(['operate']);

const loading = ref(false);
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

/**
 * 取出 el-table-column 的配置，去掉 visiable / visible / toFixed 这些业务字段
 */
const getColumnProps = (option = {}) => {
    const columnProps = { ...option };
    delete columnProps.visiable;
    delete columnProps.visible;
    delete columnProps.toFixed;
    return columnProps;
};

/**
 * 表格列：
 * - 过滤 option.visiable === false 的字段；
 * - label 优先取 label，其次取 JSON Schema 的 title，最后退回字段名；
 * - 去掉 visiable / toFixed 等业务字段，只把 el-table-column 的配置传给组件。
 */
const tableColumns = computed(() => {
    const properties = schema.value?.properties ?? {};

    return Object.keys(properties)
        .filter((key) => {
            const option = properties[key]?.option ?? {};
            return (option.visiable ?? option.visible) !== false;
        })
        .map((key) => {
            const schemaItem = properties[key] ?? {};

            return {
                key,
                label: schemaItem.label ?? schemaItem.title ?? key,
                props: getColumnProps(schemaItem.option),
            };
        });
});

const operationWidth = computed(() => {
    const list = buttons.value ?? [];
    if (!list.length) {
        return 80;
    }

    return list.reduce((pre, cur) => pre + (cur.label?.length ?? 2) * 18, 50);
});

// label / eventKey / eventOption 是业务字段，不透传给 el-button
const getButtonProps = (btnConfig = {}) => {
    const buttonProps = { ...btnConfig };
    delete buttonProps.label;
    delete buttonProps.eventKey;
    delete buttonProps.eventOption;
    return buttonProps;
};

const initData = async () => {
    currentPage.value = 1;
    pageSize.value = 10;
    await nextTick();
    await fetchTableData();
};

let timerId = null;
const loadTableData = () => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
        fetchTableData();
        timerId = null;
    }, 100); // 防抖 100ms
};

const fetchTableData = async () => {
    if (!api.value) {
        tableData.value = [];
        total.value = 0;
        return;
    }

    showLoading();

    try {
        const res = await curl({
            method: 'get',
            url: `${api.value}/list`,
            query: {
                page: currentPage.value,
                // 后端 list 接口的 query schema 约定的是 size
                size: pageSize.value,
            },
        });

        if (!res || !res.success || !Array.isArray(res.data)) {
            tableData.value = [];
            total.value = 0;
            return;
        }

        tableData.value = buildTableData(res.data);

        // curl 返回的是 metadata（小写），兼容 total / totalCount 两种字段
        const metadata = res.metadata ?? {};
        const totalCount = Number(metadata.total ?? metadata.totalCount);
        total.value = Number.isFinite(totalCount) ? totalCount : tableData.value.length;
    } catch (error) {
        tableData.value = [];
        total.value = 0;
        console.error('schema-table fetch error', error);
    } finally {
        hideLoading();
    }
};

/**
 * 对后端返回的数据进行渲染前的预处理
 * @param data 列表数据
 */
const buildTableData = (listData) => {
    const properties = schema.value?.properties ?? {};

    return listData.map((rowData) => {
        const row = { ...rowData };

        for (const key in row) {
            const toFixed = properties[key]?.option?.toFixed;

            if (toFixed === undefined || row[key] === null || row[key] === '') {
                continue;
            }

            const digits = Number(toFixed);
            const value = Number(row[key]);

            // toFixed 只在 0~100 的整数且值为合法数字时生效
            if (Number.isInteger(digits) && digits >= 0 && digits <= 100 && !Number.isNaN(value)) {
                row[key] = value.toFixed(digits);
            }
        }

        return row;
    });
};

const showLoading = () => {
    loading.value = true;
};

const hideLoading = () => {
    loading.value = false;
};

const operationHandler = ({ btnConfig, rowData }) => {
    emit('operate', { btnConfig, rowData });
};

const onPageSizeChange = (value) => {
    pageSize.value = value;
    // 每页条数变化后页码归位，避免停留在越界页
    currentPage.value = 1;
    loadTableData();
};

const onCurrentChange = (value) => {
    currentPage.value = value;
    loadTableData();
};

// schema / api 变化时统一走 loadTableData 的防抖：
// 菜单数据、schema 可能在多个 tick 内连续更新，合并后只发一次请求
watch(
    [schema, api],
    () => {
        currentPage.value = 1;
        pageSize.value = 10;
        loadTableData();
    },
    {
        deep: true,
        immediate: true,
    }
);

defineExpose({
    initData,
    loadTableData,
    showLoading,
    hideLoading,
});
</script>

<style lang="less" scoped>
.schema-table {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;

    &__table {
        flex: 1;
    }

    &__pagination {
        margin: 10px 0;
    }
}
</style>
