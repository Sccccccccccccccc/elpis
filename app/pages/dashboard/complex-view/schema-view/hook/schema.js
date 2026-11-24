import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '@/store/menu';

export const useSchema = () => {
    const route = useRoute();
    const menuStore = useMenuStore();

    const api = ref('');
    const tableSchema = ref({});
    const tableConfig = ref({});

    // 通用构建 schema 方法，清除噪音（删除其他字段）
    const buildDtoSchema = (_schema, comName) => {
        if( !_schema?.properties ) return {};

        const dtoSchema = {
            type: 'object',
            properties: {},
        }

        // 提起有效 schema 字段信息
        for( const key in _schema.properties ) {
            const props = _schema.properties[key];
            if( props[`${comName}Option`]) {
                let dtoProps = {}
                for( const pKey in props) {
                    if( pKey.indexOf('Option') < 0) {
                        dtoProps[pKey] = props[pKey];
                    }
                }
                // 处理 comName Option
                dtoProps = Object.assign({}, dtoProps, { option: props[`${comName}Option`]});
                dtoSchema.properties[key] = dtoProps;
            }
        }

        return dtoSchema;
    }

    // 构造 schemaConfig 相关配置，输送给 schemaView 解释
    const buildData = () => {
        const { key, sider_key: siderKey } = route.query;

        const mItem = menuStore.findMenuItem({
            key: 'key',
            value: siderKey ?? key,
        });

        if( !mItem?.schemaConfig ) {
            api.value = '';
            tableSchema.value = {};
            tableConfig.value = {};
            return;
        }

        const { schemaConfig } = mItem;
        const configSchema = JSON.parse(JSON.stringify(schemaConfig.schema ?? {}));

        // 一次性写入最终数据：不要先写原始 schema 再用 nextTick 覆盖，
        // 否则 schema-table 的 watch 会多触发一轮请求
        api.value = schemaConfig.api ?? '';
        tableSchema.value = buildDtoSchema(configSchema, 'table');
        tableConfig.value = schemaConfig.tableConfig ?? {};
    }

    // immediate: 组件挂载时先构建一次；菜单异步返回后由 menuList 变化再构建
    watch(
        [
            () => route.query.key,
            () => route.query.sider_key,
            () => menuStore.menuList
        ],
        buildData,
        {
            deep: true,
            immediate: true,
        }
    )

    return {
        api,
        tableSchema,
        tableConfig,
    }
}
