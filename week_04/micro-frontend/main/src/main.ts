import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { registerMicroApps, start } from 'qiankun'

const microApps: any[] = [
    {
        name: 'app1',
        entry: '//localhost:2334',
        container: '#micro-app',
        activeRule: '/app1',
        props: {
            routerBase: '/app1' // 下发路由给子应用，子应用根据该值去定义qiankun环境下的路由
        }
    },
    {
        name: 'app2',
        entry: '//localhost:2335',
        container: '#micro-app',
        activeRule: '/app2',
        props: {
            routerBase: '/app2' // 下发路由给子应用，子应用根据该值去定义qiankun环境下的路由
        }
    }
]

registerMicroApps(microApps, {
    beforeLoad: (app: any) => {
        console.log('before load app.name====>>>>>', app.name)
        return Promise.resolve();
    },
    beforeMount: [
        (app: any) => {
            console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
            return Promise.resolve();
        },
    ],
    afterMount: [
        (app: any) => {
            console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name);
            return Promise.resolve();
        }
    ],
    afterUnmount: [
        (app: any) => {
            console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
            return Promise.resolve();
        }
    ]
})
start();

createApp(App).use(store).use(router).mount('#app');
