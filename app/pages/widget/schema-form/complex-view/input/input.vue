<template>
    <el-row type="flex" align="middle" :gutter="10">
        <!--label -->
        <el-row justify="end">
            <el-row 
                v-if="schema.option?.required" 
                type="flex" 
                align="middle" 
                justify="end"
            >*</el-row>
            {{ schema.label }}
        </el-row>
        <!-- value -->
        <el-row justify="end">
            <el-input
                v-model="dtoValue"
                v-bind="schema.option"
                :placeholder="placeholder"
                @focus="onFocus"
                @blur="onBlur"
            ></el-input>
        </el-row>
        <!-- 错误信息 -->
        <el-row v-if="validTips" justify="end">
            {{ schema.errorMsg }}
        </el-row>
    </el-row>
</template>

<script setup>
import { ref, toRefs, watch, inject, onMounted, defineProps } from 'vue'
const ajv = inject('ajv');
const props = defineProps({
    schemaKey: {
        type: String,
        default: ''
    },
    schema: {
        type: Object,
        default: () => ({})
    },
    model: {
        type: Object,
        default: () => ({})
    },
})

const { schemaKey, schema } = props;
const { model } = toRefs(props);
const validTip = ref(null);
const dtoValue = ref('')
const placeholder = ref(schema.option?.placeholder ?? '请输入')

const initData = () => {
    dtoValue.value = model.value ?? schema.option?.default;
    validTip.value = null;
}

onMounted(() => {   
    initData();
})

watch([ model, schema ], () => {
    initData();
})

const validate = () => {
    validTip.value = null;
    const { type } = schema;

    // 提取规则
    const {
        minLength,
        maxLength,
        pattern,
    } = schema;

    const ruleList = [];
    if(schema.option?.placeholder) {
        ruleList.push(schema.option.placeholder);
    }
    if (minLength) {
        ruleList.push(`最小长度: ${minLength}`);
    }
    if (maxLength) {
        ruleList.push(`最大长度: ${maxLength}`);
    }
    if (pattern) {
        ruleList.push(`格式: ${pattern}`);
    }

    placeholder.value = ruleList.join('|');

    // 校验是否必填
    if (schema.option?.required && !dtoValue.value) {
        validTip.value = '不能为空';
        return false;
    }

    // 校验 schema
    if (dtoValue.value) {
        const validate = ajv.compile(schema);
        const valid = validate(dtoValue.value);
        if (!valid && validate.errors && validate.errors[0]) {
            const { keyword, params } = validate.errors[0];
            if( keyword === 'type') {
                validTip.value = `类型不匹配，必须为${type}类型`;
            } else if(keyword === 'maxLength') {
                validTip.value = `长度不能超过${params.limit}位`;
            } else if(keyword === 'minLength') {
                validTip.value = `最小长度应为${params.limit}位`;
            } else if(keyword === 'pattern') {
                validTip.value = `格式不正确`;
            } else {
                console.error( validate.errors[0] );
                validTip.value = '校验失败';
            }
        };
        return false;
    };

    return true;
}

const getValue = () => {
    return dtoValue.value !== undefined ? {
        [schemaKey]: dtoValue.value
    } : {};
}

const onFocus = () => {
    validTip.value = null;
}

const onBlur = () => {
    validate();
}

defineExpose({
    validate,
    getValue
})

</script>

<style lang="less" scoped>

</style>