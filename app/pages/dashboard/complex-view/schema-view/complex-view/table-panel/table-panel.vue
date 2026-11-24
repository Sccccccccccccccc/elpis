<template>
    <el-card class="table-panel">
        <!-- operation-panel -->
        <el-row 
            v-if="tableConfig?.headerButtons?.length > 0" 
            class="table-panel__operation-panel"
            justify="end"
        >
            <el-button
                v-for="item in tableConfig?.headerButtons"
                :key="item.eventKey || item.label"
                v-bind="item"
                @click="operationHandler({ btnConfig: item })"
            >
                {{ item.label }}
            </el-button>
        </el-row>
        <!-- schema-table (widget组件) -->
        <schema-table
            ref="schemaTableRef"
            :schema="tableSchema"
            :api="api"
            :apiParams="apiParams"
            :buttons="tableConfig?.rowButtons ?? []"
            @operate="operationHandler"
        >

        </schema-table>
    </el-card>
</template>

<script setup>
import { ref, inject } from 'vue';
import { ElMessageBox, ElNotification } from 'element-plus';
import curl from '@/common/curl';
import SchemaTable from '@/widget/schema-table/schema-table.vue';

const emit = defineEmits(['operate']);

const { 
    api, 
    apiParams,
    tableSchema, 
    tableConfig 
} = inject('schemaViewData');

const schemaTableRef = ref(null);

const operationHandler = ({ btnConfig, rowData }) => {
    // 注意：不要在这里提前构造 map 引用 removeData，removeData 是在下面用 const 声明的
    if (btnConfig.eventKey === 'remove') {
        removeData({ btnConfig, rowData });
        return;
    }

    emit('operate', { btnConfig, rowData });
}

const removeData = ({ btnConfig, rowData }) => {
    const params = btnConfig.eventOption?.params;
    if (!params) {
        return;
    }

    const removeKey = Object.keys(params)[0];
    const rule = String(params[removeKey] ?? '');
    const [source, sourceKey] = rule.split('::');
    // 参数形如 schema::product_id 时，从当前行数据里取值
    const removeValue = source === 'schema' && sourceKey
        ? rowData?.[sourceKey]
        : rule;

    ElMessageBox.confirm(`确认删除数据 ${removeKey} 为 ${removeValue}?`, 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        schemaTableRef.value?.showLoading();

        try {
            const res = await curl({
                method: 'delete',
                url: api.value,
                data: {
                    [removeKey]: removeValue
                },
                errorMessage: '删除失败'
            });

            if (!res || !res.success) {
                return;
            }

            ElNotification({
                title: '删除成功',
                message: '删除成功',
                type: 'success'
            });

            await initTableData();
        } finally {
            schemaTableRef.value?.hideLoading();
        }
    }).catch(() => {
        // 用户取消确认
    });
}

const initTableData = async () => {
    await schemaTableRef.value.initData();
}

const loadTableData = async () => {
    await schemaTableRef.value.loadTableData();
}

defineExpose({
    loadTableData
})

</script>

<style lang="less" scoped>
.table-panel {
    flex: 1;
    margin: 10px;
}
</style>