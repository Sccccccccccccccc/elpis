<template>
    <el-drawer 
        v-model="isShow" 
        direction="rtl" 
        :size="550"
        :destroy-on-close="true"
    >
        <template #header>
            <h2>{{ title }}</h2>
        </template>
        <template #default>
            <schema-form 
                ref="schemaFormRef"
                v-loading="loading" 
                :schema="components[name]?.schema" 
                :model="dtoModel"
            >
            </schema-form>
        </template>
        <template #footer>
            <el-button 
                type="primary" 
                @click="submit"
            >
                {{ saveBtnText }}
            </el-button>
        </template>
    </el-drawer>
</template>

<script setup>
import { ref, inject } from 'vue'
import { ElNotification } from 'element-plus';
import curl from '@/common/curl';
import SchemaForm from '@/widget/schema-form/schema-form.vue';

const {
    api,
    components
} = inject('schemaViewData');

const emit = defineEmits(['command']);
const title = ref('编辑表单');
const loading = ref(false);
const isShow = ref(false);
const saveBtnText = ref('保存');
const mainKey = ref('');
const mainValue = ref('');
const dtoModel = ref({});
const schemaFormRef = ref(null);

const show = (rowData) => {
    const { config } = components.value[name.value];

    title.value = config.title;
    saveBtnText.value = config.saveBtnText;
    mainKey.value = config.mainKey; // 表单主键字段
    mainValue.value = rowData?.[config.mainKey]; // 表单主键值

    // 先用表格里的行数据回显，不等接口，抽屉一打开就有内容
    dtoModel.value = { ...(rowData ?? {}) };

    isShow.value = true;

    // 再拉一次详情接口，用服务端数据覆盖（demo 阶段接口返回的是同一份 mock）
    fetchFormData();
}

const close = () => {
    isShow.value = false;
}

const fetchFormData = async () => {
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

        // 成功才回填：原来的写法是 res.success 为真时直接 return，永远赋值不上
        if (!res || !res.success || !res.data) {
            return;
        }

        dtoModel.value = { ...res.data };
    } finally {
        loading.value = false;
    }
}

const submit = async () => {
    if (loading.value) { return; }

    if (!schemaFormRef.value.validate()) { return; }

    loading.value = true;

    try {
        const res = await curl({
            method: 'PUT',
            url: api.value,
            data: {
                [mainKey.value]: mainValue.value,
                ...schemaFormRef.value.getValue()
            }
        });

        if (!res || !res.success) { return; }

        ElNotification.success({
            title: '成功',
            message: res.message || '修改成功',
            type: 'success'
        })
        close();

        emit('command', {
            event: 'loadTableData',
        })
    } finally {
        loading.value = false;
    }
}

const name = ref('editForm')
defineExpose({
  name,
  show
})
</script>

<style lang="less" scoped>

</style>