<template>
    <el-card>
        <schema-search-bar 
            class="search-panel"
            @load="onLoad"
            @reset="onReset"
            @search="onSearch" 
            :schema="searchSchema" 
        />
    </el-card>
</template>

<script setup>
import { inject } from 'vue';
import schemaSearchBar from '@/widget/schema-search-bar/schema-search-bar.vue';
const { searchSchema } = inject('schemaViewData');

const emit = defineEmits(['search']);

const onLoad = (searchValObj) => {
    emit('search', searchValObj);
}

const onSearch = (searchValObj) => {    
    emit('search', searchValObj);
}

const onReset = () => {
    emit('search', {});
}

</script>

<style lang="less" scoped>

</style>