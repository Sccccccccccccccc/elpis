<template>
    <div class="schema-form-item">
        <el-select 
            v-model="dtoValue" 
            v-bind="schema.option" 
            placeholder="请选择"
            @change="onChange"
        >
            <el-option
                v-for="item in schema.option?.enumList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
        <!-- 错误信息 -->
        <div v-if="validTip" class="schema-form-item__error">
            {{ schema.errorMsg || validTip }}
        </div>
    </div>
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
        type: [String, Number],
        default: () => ({})
    },
})

const { schemaKey, schema } = props;
const { model } = toRefs(props);
const validTip = ref(null);
const dtoValue = ref('')

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
        minium,
        maxium,
    } = schema;

    // 校验是否必填
    if (schema.option?.required && !dtoValue.value) {
        validTip.value = '不能为空';
        return false;
    }

    // ajv 校验 schema
    if (dtoValue.value) {
        let dtoEnumList = [];
        if (schema.option?.enumList) {
            dtoEnumList = schema.option.enumList.map(item => item.value);
        }
        const validate = ajv.compile({
            schema,
            ...{ enum: dtoEnumList },
        });
        const valid = validate(dtoValue.value);
        if( !valid && validate.errors && validate.errors[0] ) { 
            if(validate.errors[0].keyword === 'enum') {
                validTip.value = '不在枚举范围内';
            } else {
                validTip.value = '不符合要求';
            }
            return false;
        }
    };

    return true;
}

const getValue = () => {
    return dtoValue.value !== undefined ? {
        [schemaKey]: dtoValue.value
    } : {};
}

const onChange = (e) => {
    validate();
}

const name = ref('select');
defineExpose({
    validate,
    getValue,
    name
})

</script>

<style lang="less" scoped>

</style>