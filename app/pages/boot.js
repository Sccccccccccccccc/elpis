import { createApp } from 'vue'

// 引入 elementUI-plus
import ElementUIPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import pinia from '$store'
import { createRouter, createWebHistory } from 'vue-router'

import './assets/css/custom.css'

/**
 * vue 页面主入口，用于启动vue
 * @param {Object} pageComponent vue 入口组件
 * @param routes 路由列表
 * @param libs 页面依赖的第三方包
 */

export default function boot(pageComponent, { routes, libs} = {}) {
    const app = createApp(pageComponent);

    // 应用 ElementUI
    app.use(ElementUIPlus)

    // 引入 pinia
    app.use(pinia);

    // 引入第三方包
    if( libs && libs.length ) {
        for( let i = 0; i < libs.length; i++ ) {
            app.use(libs[i]);
        }
    }

    if( routes && routes.length ) {

        // 页面路由
        const router = createRouter({
            history: createWebHistory(), // 路由采用 history 模式
            routes
        })
        app.use(router);
        router.isReady().then(() => {
            app.mount('#app');
        })

    }else {
        app.mount('#app');
    }



    
} 