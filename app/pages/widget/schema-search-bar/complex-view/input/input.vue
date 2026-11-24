<template>
    <!-- v-bind 透传 searchOption 相关内容 -->
    <el-input v-model="dtoValue" v-bind="schema.option">

    </el-input>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const { schemaKey, schema } = defineProps({
    schemaKey: String,
    schema: Object
})

const emit = defineEmits(['loaded'])

const dtoValue = ref()
const getValue = () => {
    return dtoValue.value !== undefined ? {
        [schemaKey]: dtoValue.value
    } : {}
}

const reset = () => {
    dtoValue.value = schema?.option?.default;
}

defineExpose({
    getValue,
    reset
})

</script>

<style lang="less" scoped>

</style>
