import boot from "@/boot.js";
import Dashboard from "./dashboard.vue";

const routes = [];

// 头部菜单路由
// 路由已修改为 history 模式, path 需要补充前缀 /view/dashboard
routes.push({
    path: '/view/dashboard/iframe',
    component: () => import('./complex-view/iframe-view/iframe-view.vue')
})
routes.push({
    path: '/view/dashboard/schema',
    component: () => import('./complex-view/schema-view/schema-view.vue')
})

// custom 自定义路由
routes.push({
    path: '/view/dashboard/todo',
    component: () => import('./todo-view/todo-view.vue')
})

// 侧边栏菜单路由
routes.push({
    path: '/view/dashboard/sider',
    component: () => import('./complex-view/sider-view/sider-view.vue'),
    children: [
        {
            path: 'iframe',
            component: () => import('./complex-view/iframe-view/iframe-view.vue')
        },
        {
            path: 'schema',
            component: () => import('./complex-view/schema-view/schema-view.vue')
        },
        {
            path: 'todo',
            component: () => import('./todo-view/todo-view.vue')
        }
    ]
})

// 侧边栏兜底策略
routes.push({
    path: '/view/dashboard/sider/:chapters+',
    component: () => import('./complex-view/sider-view/sider-view.vue'),
})

boot(Dashboard, { routes });