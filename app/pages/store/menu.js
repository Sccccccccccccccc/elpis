import { defineStore } from "pinia";

import { ref } from "vue";

export const useMenuStore = defineStore("menu", () => {
    // 菜单列表
    const menuList = ref([])

    // 设置menu列表
    const setMenuList = (list) => {
        menuList.value = list
    }

    /**
     * 获取menu列表
     * @param key 搜索字段 
     * @param value 搜索值
     * @param mList 要搜索的菜单列表
     */
    const findMenuItem = ({ key, value }, mList = menuList.value) => {
        for (let i = 0; i < mList.length; i++) {
            const menuItem = mList[i];

            if (!menuItem) {
                continue;
            }

            // 命中当前菜单项：例如 key === 'key' 时，比较的是 menuItem.key
            if (menuItem[key] === value) {
                return menuItem;
            }

            // 分组菜单：递归查找子菜单
            if (menuItem.menuType === 'group' && Array.isArray(menuItem.subMenu)) {
                const subItem = findMenuItem({ key, value }, menuItem.subMenu);
                if (subItem) {
                    return subItem;
                }
            }

            // 侧边栏模块：递归查找 siderConfig.menu
            if (
                menuItem.menuType === 'module'
                && menuItem.moduleType === 'sider'
                && Array.isArray(menuItem.siderConfig?.menu)
            ) {
                const siderItem = findMenuItem({ key, value }, menuItem.siderConfig.menu);
                if (siderItem) {
                    return siderItem;
                }
            }
        }

        return undefined;
    }

    /**
     * 获取第一个菜单项
     * @param mList 菜单列表
     */
    const findFirstMenuItem = (mList = menuList.value) => {
        if (mList || !mList[0]) { return; }
        let firstMenuItem = mList[0];
        if (firstMenuItem.subMenu) {
            firstMenuItem = findFirstMenuItem(firstMenuItem.subMenu);
        }
        return firstMenuItem;
    }

    return {
        menuList,
        setMenuList,
        findMenuItem,
        findFirstMenuItem,
    }
})