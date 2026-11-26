import input from "./complex-view/input/input.vue"
import inputNumber from "./complex-view/input-number/input-number.vue"
import select from "./complex-view/select/select.vue"
import addressCascader from "./complex-view/address-cascader/address-cascader.vue"

const FormItemConfig = {
    input: {
        component: input,
    },
    inputNumber: {
        component: inputNumber,
    },
    select: {
        component: select,
    },
    // key 必须和 schema 里 option.comType 的值完全一致（区分大小写）
    addressCascader: {
        component: addressCascader,
    }
}

export default FormItemConfig