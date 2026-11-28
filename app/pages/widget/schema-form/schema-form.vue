<template>
    <el-form
        v-if="schema && schema.properties"
        class="schema-form"
        label-width="96px"
        label-position="right"
        @submit.prevent
    >
        <el-form-item
            v-for="(itemSchema, key) in schema.properties"
            v-show="isItemVisible(itemSchema)"
            :key="key"
            :label="getItemLabel(itemSchema, key)"
            :required="itemSchema.option?.required === true"
        >
            <component
                v-if="FormItemConfig[itemSchema.option?.comType]"
                :ref="(el) => setItemRef(key, el)"
                :is="FormItemConfig[itemSchema.option?.comType]?.component"
                :schemaKey="key"
                :schema="itemSchema"
                :model="model ? model[key] : undefined"
            />
            <!-- comType 没注册时给出明确提示，否则页面上只是一个空白项 -->
            <span v-else class="schema-form__missing">
                未注册的控件类型：{{ itemSchema.option?.comType }}
            </span>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { toRefs, provide } from 'vue'
import FormItemConfig from './form-item-config.js';
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

const { schema, model } = toRefs(props);

// 表单项实例按字段 key 存：v-for 里的函数 ref 每次 patch 都会重新执行，
// 用数组 push 会重复堆积，按 key 覆盖写入才幂等
const formComMap = {};

const setItemRef = (key, el) => {
    if (el) {
        formComMap[key] = el;
    }
}

const getItemList = () => Object.values(formComMap);

// visible / visiable 都支持，默认展示
const isItemVisible = (itemSchema) => {
    const option = itemSchema?.option ?? {};
    return option.visible !== false && option.visiable !== false;
}

const getItemLabel = (itemSchema, key) => itemSchema?.label ?? itemSchema?.title ?? key;

const validate = () => {    
    // 每个表单项都要跑一遍，不能用 some 短路，否则后面的错误提示出不来
    return getItemList().reduce((valid, item) => {
        const itemValid = item?.validate?.();

        if (itemValid === false) {            
            return false;
        }

        return valid;
    }, true);
}

const getValue = () => {
    return getItemList().reduce((dtoObj, item) => {
        return {
            ...dtoObj,
            ...(item?.getValue?.() ?? {}),
        };
    }, {});
}

defineExpose({
    validate,
    getValue,
})

</script>

<style lang="less" scoped>
.schema-form {
    padding-top: 8px;

    :deep(.el-form-item) {
        margin-bottom: 18px;
    }

    :deep(.el-form-item__label) {
        font-weight: 500;
        color: var(--el-text-color-regular);
    }

    // 让控件和错误提示纵向排列，控件占满整行
    :deep(.el-form-item__content) {
        display: block;
        line-height: normal;
    }

    :deep(.schema-form-item) {
        width: 100%;
    }

    // el-input-number 默认 150px，表单里统一拉满
    :deep(.el-input-number) {
        width: 100%;
    }

    :deep(.schema-form-item__error) {
        margin-top: 4px;
        font-size: 12px;
        line-height: 1.4;
        color: var(--el-color-danger);
    }

    &__missing {
        font-size: 12px;
        color: var(--el-color-danger);
    }
}
</style>
