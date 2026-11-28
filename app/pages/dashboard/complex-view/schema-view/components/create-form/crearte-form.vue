<template>
    <el-drawer
        v-model="isShow"
        direction="rtl"
        :destroy-on-close="true"
        :size="550"
        class="create-form"
    >
        <template #header>
            <h3>{{ title }}</h3>
        </template>
        <template #default>
            <schema-form
                ref="schemaFormRef"
                v-loading="loading"
                :schema="components[name]?.schema"
            ></schema-form>
        </template>
        <template #footer>
            <el-button
                type="primary"
                class="create-form__submit"
                @click="submit"
            >
                {{ saveBtnText }}
            </el-button>
        </template>
    </el-drawer>
</template>

<script setup>
import { ref, inject } from 'vue'
import SchemaForm from '@/widget/schema-form/schema-form.vue'
import curl from '@/common/curl';
import { ElNotification } from 'element-plus';
import { method } from 'lodash';
const {
    api,
    components
} = inject('schemaViewData')

const emit = defineEmits(['command'])

const name = ref('createForm')
const isShow = ref(false)

const schemaFormRef = ref(null)
const loading = ref(false)
const title = ref('');
const saveBtnText = ref('');

const show = (rowData) => {
    const { config } = components.value[name.value];
    title.value = config.title;
    saveBtnText.value = config.saveBtnText;

    isShow.value = true;
}

const close = () => {
    isShow.value = false;
}

const submit = async () => {    
    // 校验表单
    if( !schemaFormRef.value.validate()) { return; }
    loading.value = true;

    const res = await curl({
        method: 'post',
        url: api.value,
        data: {
            ...schemaFormRef.value.getValue()
        }
    });

    if( !res || !res.success ) { return; }

    ElNotification({
        title: '创建成功',
        message: '创建成功',
        type: 'success',
    })

    close();
    emit('command', {
        event: 'loadTableData'
    });
}

defineExpose({
    name,
    show
})

</script>

<style lang="less" scoped>
:deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 16px 24px;
    border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-drawer__body) {
    padding: 16px 24px 0;
    overflow: auto;
}

:deep(.el-drawer__footer) {
    padding: 12px 24px 20px;
    border-top: 1px solid var(--el-border-color-lighter);
}

.create-form__submit {
    width: 100%;
}

h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}
</style>