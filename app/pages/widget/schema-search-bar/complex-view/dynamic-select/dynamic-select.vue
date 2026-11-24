<template>
    <!-- v-bind 透传 searchOption 相关内容 -->
    <el-select 
        v-model="dtoValue" 
        v-bind="schema.option"
        class="schema-search-bar__dynamic-select"
    >
        <el-option
            v-for="item in enumList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
    </el-select>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import curl from '@/common/curl';

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

const enumList = ref([]);
const reset = () => {
    dtoValue.value = schema?.option?.default ?? enumList.value[0]?.value;
}

const fetchEnumList = async () => {
    const url = schema?.option?.api;

    // 没配 api 就别发请求，否则 axios 拿 undefined 当 url 直接抛错
    if (!url) {
        return;
    }

    const res = await curl({
        method: 'get',
        url,
    });

    // 注意是 length 不是 lenght
    if (Array.isArray(res?.data) && res.data.length > 0) {
        enumList.value.push(...res.data);
    }
}

onMounted(async () => {
    await fetchEnumList();
    reset();
    emit('loaded');
})

defineExpose({
    getValue,
    reset
})

</script>

<style lang="less" scoped>
.schema-search-bar__dynamic-select {
    width: 120px;
}
</style>
