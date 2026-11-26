<template>
    <el-form 
        v-if="schema && schema.properties"
        :inline="true"
        class="schema-search-bar"
    >
        <el-form-item
            v-for="(item, key) in schema.properties"
            :key="key"
            :label="item.label || item.title"
        >   
            <!-- v-for里为什么要有key? vue3中使用的是快速diff算法，存在key时才可以使用bound diff -->
            <!-- 动态组件区域 -->
            <component 
                :ref="searchComList"
                :is="SearchItemConfig[item.option?.comType]?.component"
                :schemaKey="key"
                :schema="item"
                @loaded="handleChildLoaded"
            ></component>
        </el-form-item>
        <el-form-item>
            <!-- 操作区域 -->
             <el-button
                type="primary"
                plain
                class="schema-search-bar__btn-search"
                @click="search"
             >搜索</el-button>
             <el-button
                plain
                class="schema-search-bar__btn-reset"
                @click="reset"
             >重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import SearchItemConfig from './search-item-config';

const props = defineProps({
    /**
     * schema 配置，结构参考 doc
     * {
            api: '/api/user', // 数据源API 遵循RESTFUL规范
            schema: {
                // 板块数据结构
                type: 'object',
                properties: {
                    key: {
                        ...schema, // 标准schema配置
                        label: '', // 字段的中文名
                        type: '', // 字段类型

                        // 字段在 table 中的相关配置
                        tableConfig: {
                            ...elTableColumnConfig, // 标准 el-table-column 配置
                            toFixed: 0, // 保留小数点后几位
                            visiable: true, // 是否在表格中显示, 默认为true, false时表示不在表单中展示
                        },

                        // 字段在 search-bar 中的相关配置
                        option: {
                            ...elComponentConfig, // 标准 el-component(el-form、el-input、el-select等) 配置
                            comType: '', // 配置组件类型 'input/select/...'
                            default: '', // 搜索框展示的默认值

                        }
                    },
                    tableConfig: {},
                    ...
                }
            },
     */
    schema: Object,

});

const { schema } = toRefs(props);

const emit = defineEmits(['load', 'search', 'reset' ]);

const searchComList = ref([]);

const getValue = () => {
    let dtoObj = {};
    searchComList.value.forEach( component => {
        dtoObj = {
            ...dtoObj,
            ...component?.getValue()
        }
    })

    return dtoObj;
}

let childComponentLoadedCount = 0;
const handleChildLoaded = () => {
    childComponentLoadedCount++;
    if( childComponentLoadedCount >= Object.keys(schema?.value?.properties).length) {
        // 所有子组件加载完成
        emit('load', getValue());
    }
}

const search = () => {
    console.log('wiget search111', schema,  getValue());
    
    emit('search', getValue());
};

const reset = () => {
    searchComList.value.forEach( component => {
        component?.reset();
    })
    emit('reset');
};

const load = () => {
    emit('load');
};

defineExpose({
    reset,
    getValue,
})

</script>

<style lang="less" scoped>

</style>