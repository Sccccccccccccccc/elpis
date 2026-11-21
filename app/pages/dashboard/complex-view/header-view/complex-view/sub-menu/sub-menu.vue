<template>
    <el-sub-menu :index="menuItem.key">
        1121
        <template #title>
            <span>{{ menuItem.name }}</span>
        </template>
        <template v-for="item in menuItem.subMenu" :key="item.key">
            <sub-menu 
                v-if="item.subMenu && item.subMenu.length" 
                :menuItem="item"
            ></sub-menu>
            <el-menu-item v-else :index="item.key">{{ item.name }}</el-menu-item>
        </template>
    </el-sub-menu>
</template>

<script setup>
const { menuItem } = defineProps(['menuItem'])
</script>

<style lang="less" scoped>

</style>