<template>
    <el-sub-menu :index="menuItem.key">
        <template #title>
            {{ menuItem.name }}
        </template>
        <template v-for="item in menuItem.subMenu">
            <sub-menu
                v-if="item.subMenu && item.subMenu.length > 0"
                :key="item.key"
                :menu-item="item"
            />
            <el-menu-item v-else :key="item.key" :index="item.key">
                {{ item.name }}
            </el-menu-item>
        </template>
    </el-sub-menu>
</template>

<script setup>
const { menuItem } = defineProps(['menuItem'])

</script>

<style lang="less" scoped>

</style>