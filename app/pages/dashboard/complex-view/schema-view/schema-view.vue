<template>
    <el-row class="schema-view">
        <search-panel 
            v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0" 
            @search="onSearch"
        >

        </search-panel>
        <table-panel @operate="onTableOperate">

        </table-panel>
    </el-row>
</template>

<script setup>
import { provide, ref } from 'vue';
import SearchPanel from './complex-view/search-panel/search-panel.vue';
import TablePanel from './complex-view/table-panel/table-panel.vue';
import { useSchema } from './hook/schema.js';

const { 
    api, 
    tableConfig, 
    tableSchema,
    searchConfig,
    searchSchema
} = useSchema();

const apiParams = ref({})
provide('schemaViewData', {
    api,
    apiParams,
    tableConfig,
    tableSchema,
    searchConfig,
    searchSchema
})

const onSearch = (searchValObj) => {
    console.log('onSearch----1', searchValObj, apiParams.value);
    
    apiParams.value = searchValObj;
}

const onTableOperate = () => {
    console.log('onTableOperate');
}

</script>

<style lang="less" scoped>
.schema-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>
