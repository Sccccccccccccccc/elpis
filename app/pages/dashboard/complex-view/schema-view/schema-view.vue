<template>
    <el-row class="schema-view">
        <search-panel 
            ref="searchPanelRef"
            v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0" 
            @search="onSearch"
        >

        </search-panel>
        <table-panel ref="tablePanelRef" @operate="onTableOperate">

        </table-panel>

        <component
            v-for="(item, key) in components"
            :key="key"
            :is="componentConfig[key]?.component"
            ref="comListRef"
            @command="onComponentCommand"
        >

        </component>

    </el-row>
</template>

<script setup>
import { provide, ref } from 'vue';
import SearchPanel from './complex-view/search-panel/search-panel.vue';
import TablePanel from './complex-view/table-panel/table-panel.vue';
import componentConfig from './components/component-config.js';
import { useSchema } from './hook/schema.js';

const { 
    api, 
    tableConfig, 
    tableSchema,
    searchConfig,
    searchSchema,
    components
} = useSchema();

const apiParams = ref({})
provide('schemaViewData', {
    api,
    apiParams,
    tableConfig,
    tableSchema,
    searchConfig,
    searchSchema,
    components
})

const tablePanelRef = ref(null);
const searchPanelRef = ref(null);
const comListRef = ref(null);

const onSearch = (searchValObj) => {    
    apiParams.value = searchValObj;
}

// table 事件映射
const EventHandlerMap = {
    showComponent: showComponent,
}

const onTableOperate = ({ btnConfig, rowData }) => {
    const { eventKey } = btnConfig;
    if(EventHandlerMap[eventKey]) {
        EventHandlerMap[eventKey]({ btnConfig, rowData });
    }
}

const onComponentCommand = (command) => {
    
}

// showComponent 展示动态组件
function showComponent({ btnConfig, rowData }) {
    const { comName } = btnConfig.eventOption;
    if( !comName ) { return; }
    console.log('showComponent', comName, components);
    
    const comRef = comListRef.value.find(item => item.name === comName);

    if( !comRef || typeof comRef.show !== 'function' ) { return; }

    comRef.show({ rowData });
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
