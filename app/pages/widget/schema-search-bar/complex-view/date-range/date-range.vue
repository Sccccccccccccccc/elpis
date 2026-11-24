<template>
    <el-date-picker
        v-model="dtoValue"
        v-bind="pickerProps"
        type="daterange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        :style="pickerStyle"
        class="schema-search-bar__date-range"
    />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

const { schemaKey, schema } = defineProps({
    schemaKey: String,
    schema: Object
})

const emit = defineEmits(['loaded'])

const option = computed(() => schema?.option ?? {})

// comType / default / width 是 schema 的业务描述，不是 el-date-picker 的 prop，
// 直接 v-bind="schema.option" 会变成 comtype="dateRange" 这种无效 DOM 属性
const pickerProps = computed(() => {
    const { comType, default: defaultValue, width, ...rest } = option.value;
    return rest;
});

// width: 数字按 px，字符串（'200px' / '50%'）原样用；不配就用 el-date-picker 默认宽度
const pickerStyle = computed(() => {
    const { width } = option.value;

    if (width === undefined || width === null || width === '') {
        return {};
    }

    return {
        width: typeof width === 'number' ? `${width}px` : width
    };
});

// daterange 的值是 [start, end]（value-format 后是 'YYYY-MM-DD' 字符串），清空时是 null
const defaultValue = Array.isArray(option.value.default) ? [...option.value.default] : null;
const dtoValue = ref(defaultValue);

const getValue = () => {
    const value = dtoValue.value;

    if (!Array.isArray(value) || value.length < 2 || !value[0] || !value[1]) {
        return {};
    }

    // 区间拆成两个扁平参数，后端按天比较即可，demo 从简
    return {
        [`${schemaKey}_start`]: value[0],
        [`${schemaKey}_end`]: value[1]
    }
}

const reset = () => {
    dtoValue.value = Array.isArray(option.value.default) ? [...option.value.default] : null;
}

defineExpose({
    getValue,
    reset
})

onMounted(() => {
    emit('loaded');
})

</script>

<style lang="less" scoped>
.schema-search-bar__date-range {
    vertical-align: middle;
}
</style>
