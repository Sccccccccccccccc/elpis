<template>
    <el-row v-if="schema && schema.properties" class="schema-form">
        <template v-if="(itemSchema, key) in schema.properties">
            <component
                v-if="itemSchema.option?.visible !== false"
                :ref="formComList"
                :is="FormItemConfig[itemSchema.option?.comType]?.component"
                :schemaKey="key"
                :schema="itemSchema"
                :model="model ? model[key] : undefined"
            >

            </component>
        </template>
    </el-row>
</template>

<script setup>
import { ref, toRefs, provide } from 'vue'
import FormItemConfig from './form-item-config';
const Ajv = require('ajv');
const ajv = new Ajv();
provide('ajv', ajv)

const props = defineProps({
    /**
     * schema 配置参考 doc 里的 dashboard-model:
     * {
            // 板块数据结构
            type: 'object',
            properties: {
                key: {
                    ...schema, // 标准schema配置
                    label: '', // 字段的中文名
                    type: '', // 字段类型

                    // 字段在不同动态 component 中的相关配置， 前缀对应 componentConfig 中的键值
                    // 例如： componentConfig.createForm 这里对应 createFormOption
                    // 字段在 createForm 相关配置
                    option: {
                        ...elComponentConfig, // 继承 el-component(el-form、el-input、el-select等) 配置
                        comType: '', // 配置组件类型 'input/select/...'
                        visiable: true, // 是否展示
                        disabled: false, // 是否禁用
                        default: '', // 搜索框展示的默认值
                        required: false, // 表单项是否必填，默认 false

                        // 当 comType 为 select 时，可配置
                        enumList: [{
                            label: '', // 下拉框选项名称
                            value: '', // 下拉框选项值
                        }]
                    }
                },
                ...
            }，
            required: [], // 必填字段
        }
     * 
     */
    schema: {
        type: Object,
        default: () => ({}),
    },
    // 表单数据
    model: {
        type: Object,
        default: () => ({}),
    },
    formItemConfig: {
        type: Object,
        default: () => ({}),
    },
});

const formComList = ref([]);
const { schema, model, formItemConfig } = toRefs(props);

// 表单校验
const validate = () => {
    return formComList.value.every(item => item.validate());
}

// 获取表单值
const getValue = () => {
    let dtoObj = {};

    formComList.value.forEach(item => {
        dtoObj = {
            ...dtoObj,
            ...component.getValue(),
        }
    })

    return dtoObj;
}

defineExpose({
    validate,
    getValue,
})


</script>

<style lang="less"></style>