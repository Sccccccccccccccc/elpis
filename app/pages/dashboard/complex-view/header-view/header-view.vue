<template>
  <header-container :title="projectName">

    <template #menu-content>
        <!-- 根据 menuStore.menuList渲染  -->
        <el-menu 
            :default-active="activeKey"
            :ellipsis="false"
            mode="horizontal"
            @select="onMenuSelect"
        >
            <div v-for="item in menuStore.menuList" :key="item.key">
                
                <SubMenu v-if="item.subMenu && item.subMenu.length" :menuItem="item" />
                <el-menu-item v-else :index="item.key">
                    {{ item.name }}
                </el-menu-item>
            </div>
        </el-menu>
    </template>

    <template #setting-content>
        <!-- 根据 projectStore.projectList 渲染 -->
         <el-dropdown @command="handleProjectCommand">
            <span class="project-list">
                {{ projectName }}
                <el-icon class="el-icon--right" v-if="projectStore.projectList.length > 1">
                    <ArrowDown />
                </el-icon>
            </span>
            <template v-if="projectStore.projectList.length > 1" #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item 
                        v-for="item in projectStore.projectList" 
                        :key="item.key" 
                        :command="item.key"
                        :disabled="item.name === projectName"
                    >
                        {{ item.name }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
         </el-dropdown>
    </template>

    <template #main-content>
        <!-- 透传一个slot -->
         <slot name="main-content">
            
         </slot>
    </template>

  </header-container>
</template>

<script setup>
import { ref } from 'vue';
import headerContainer from '@/widget/header-container/assets/header-container.vue';
import SubMenu from './complex-view/sub-menu/sub-menu.vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { useMenuStore } from '@/store/menu.js';
import { useProjectStore } from '@/store/project.js';
const menuStore = useMenuStore();
const projectStore = useProjectStore();

defineProps({
  projectName: {
    type: String,
    default: '项目名称'
  }
})

const activeKey = ref('');
const onMenuSelect = (key) => {
  activeKey.value = key;
}

const handleProjectCommand = (command) => {
  projectStore.setProject(command);
}

</script>

<style lang="less" scoped>
.project-list {
    cursor: pointer;
    margin-right: 20px;
    align-items: center;
    display: flex;
    outline: none;
}
</style>