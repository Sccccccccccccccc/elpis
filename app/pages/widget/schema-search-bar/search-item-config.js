import Input from './complex-view/input/input.vue'
import Select from './complex-view/select/select.vue'
import DynamicSelect from './complex-view/dynamic-select/dynamic-select.vue';
import DateRange from './complex-view/date-range/date-range.vue';

const SearchItemConfig = {
    input: {
        component: Input,
    },
    select: {
        component: Select,
    },
    // key 必须和 schema 里 option.comType 的值完全一致（区分大小写）
    // 模板里是 SearchItemConfig[item.option?.comType]?.component，查不到就是 undefined
    dynamicSelect: {
        component: DynamicSelect,
    },
    dateRange: {
        component: DateRange,
    }
}

export default SearchItemConfig;