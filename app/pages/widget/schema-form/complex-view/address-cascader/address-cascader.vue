<template>
    <div class="schema-form-item">
        <el-cascader
            v-model="dtoValue"
            :options="cascaderOptions"
            :props="cascaderProps"
            :placeholder="placeholder"
            :disabled="disabled"
            :clearable="clearable"
            class="schema-form__address-cascader"
            @change="onChange"
        />
        <!-- 错误信息 -->
        <div v-if="validTip" class="schema-form-item__error">
            {{ schema.errorMsg || validTip }}
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { AREA_OPTIONS } from './area-data'

const props = defineProps({
    schemaKey: {
        type: String,
        default: ''
    },
    schema: {
        type: Object,
        default: () => ({})
    },
    // 表单回填数据：可能是编码数组，也可能是 '广东省/深圳市/南山区' 这样的路径字符串
    model: {
        type: [Object, Array, String],
        default: () => ({})
    },
})

const { schema, model } = toRefs(props)
const { schemaKey } = props

const validTip = ref(null)
const dtoValue = ref([])

// 区域数据：option.options 优先，方便接真实数据；没配就用内置 demo 数据
const cascaderOptions = computed(() => schema.value.option?.options ?? AREA_OPTIONS)

// el-cascader 自己的 props（注意不是 Vue 的 props）：展开方式、能否选到中间层级等
const cascaderProps = computed(() => ({
    expandTrigger: 'hover',
    ...(schema.value.option?.cascaderProps ?? {}),
}))

const placeholder = computed(() => schema.value.option?.placeholder ?? '请选择省/市/区')
const disabled = computed(() => schema.value.option?.disabled === true)
const clearable = computed(() => schema.value.option?.clearable !== false)
const separator = computed(() => schema.value.option?.separator ?? '/')
// path: 提交 '广东省/深圳市/南山区' 这样的路径字符串；codes: 提交 ['440000','440300','440305']
const valueType = computed(() => schema.value.option?.valueType ?? 'path')

// 按编码找标签路径
const findLabelsByValues = (options, values) => {
    const labels = []
    let list = options

    for (const value of values) {
        const node = (list || []).find(item => item.value === value)

        if (!node) {
            break
        }

        labels.push(node.label)
        list = node.children
    }

    return labels
}

// 按标签路径反解编码
const findValuesByLabels = (options, labels) => {
    const values = []
    let list = options

    for (const label of labels) {
        const node = (list || []).find(item => item.label === label)

        if (!node) {
            break
        }

        values.push(node.value)
        list = node.children
    }

    return values
}

// 兼容三种初始值：编码数组 / 路径字符串 / 空
const normalizeToValues = (initial) => {
    if (Array.isArray(initial)) {
        return [...initial]
    }

    if (typeof initial === 'string' && initial) {
        return findValuesByLabels(cascaderOptions.value, initial.split(separator.value))
    }

    return []
}

const initData = () => {
    const modelValue = model.value
    // 表单没给值（undefined / {} / [] / ''）时回落到 option.default
    const hasModelValue = (Array.isArray(modelValue) && modelValue.length > 0)
        || (typeof modelValue === 'string' && modelValue !== '')

    dtoValue.value = normalizeToValues(
        hasModelValue ? modelValue : schema.value.option?.default
    )
    validTip.value = null
}

onMounted(() => {
    initData()
})

watch([model, schema], () => {
    initData()
})

const getSubmitValue = () => {
    const values = dtoValue.value

    if (!Array.isArray(values) || values.length === 0) {
        return ''
    }

    if (valueType.value === 'codes') {
        return [...values]
    }

    return findLabelsByValues(cascaderOptions.value, values).join(separator.value)
}

const getValue = () => {
    return {
        [schemaKey]: getSubmitValue()
    }
}

const validate = () => {
    validTip.value = null;

    const labels = findLabelsByValues(cascaderOptions.value, dtoValue.value)
    const isEmpty = !Array.isArray(dtoValue.value) || labels.length === 0

    // 必填校验
    if (schema.value.option?.required && isEmpty) {
        validTip.value = '不能为空'
        return false
    }

    return true
}

const onChange = () => {
    validate()
}

defineExpose({
    validate,
    getValue
})

</script>

<style lang="less" scoped>
.schema-form__address-cascader {
    width: 100%;
}
</style>
