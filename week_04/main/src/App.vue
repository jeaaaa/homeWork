<template>
    <div class="layout-wrapper">
        <ul class="sub-apps left">
            <li v-for="(item, index) in list.result" :class="{ active: num === index }" @click="setCount(item, index)">
                {{ item.title }}
            </li>
            <li v-for="item in microApps" :class="{ active: item.activeRule === current }" :key="item.name" @click="goto(item)">
                {{ item.name }}
            </li>
            <!-- <li class="userinfo">主应用的state：{{ JSON.stringify(user) }}</li> -->
        </ul>

        <div id="subapp-viewport"></div>
    </div>
</template>

<script>
import NProgress from 'nprogress'
import microApps from './micro-app'
import store, { mutations } from '@/store'
export default {
    name: 'App',
    data() {
        return {
            isLoading: true,
            microApps,
            current: '/sub-vue/',
            list: [],
            num: null
        }
    },
    watch: {
        isLoading(val) {
            if (val) {
                NProgress.start()
            } else {
                this.$nextTick(() => {
                    NProgress.done()
                })
            }
        }
    },
    components: {},
    methods: {
        setCount(data, index) {
            console.log(index)
            this.num = index
            console.log(this.num)
            console.log(data)
            mutations.setMsg(JSON.stringify(data))
        },
        getList() {
            return fetch('https://api.apiopen.top/getWangYiNews', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    page: 1,
                    count: 20
                })
            }).then((response) => response.json())
        },
        goto(item) {
            history.pushState(null, item.activeRule, item.activeRule)
            // this.current = item.name
        },
        bindCurrent() {
            const path = window.location.pathname
            if (this.microApps.findIndex((item) => item.activeRule === path) >= 0) {
                this.current = path
            }
        },
        listenRouterChange() {
            const _wr = function (type) {
                const orig = history[type]
                return function () {
                    const rv = orig.apply(this, arguments)
                    const e = new Event(type)
                    e.arguments = arguments
                    window.dispatchEvent(e)
                    return rv
                }
            }
            history.pushState = _wr('pushState')

            window.addEventListener('pushState', this.bindCurrent)
            window.addEventListener('popstate', this.bindCurrent)

            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('pushState', this.bindCurrent)
                window.removeEventListener('popstate', this.bindCurrent)
            })
        }
    },
    async created() {
        this.bindCurrent()
        NProgress.start()
        this.list = await this.getList()
    },
    mounted() {
        this.listenRouterChange()
    }
}
</script>

<style lang="scss">
html,
body {
    margin: 0 !important;
    padding: 0;
}
.github-corner:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
}
@keyframes octocat-wave {
    0%,
    100% {
        transform: rotate(0);
    }
    20%,
    60% {
        transform: rotate(-25deg);
    }
    40%,
    80% {
        transform: rotate(10deg);
    }
}
@media (max-width: 500px) {
    .github-corner:hover .octo-arm {
        animation: none;
    }
    .github-corner .octo-arm {
        animation: octocat-wave 560ms ease-in-out;
    }
}
.layout-wrapper {
    display: grid;
    grid-template-columns: 320px 1fr;
    .left {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgb(15, 14, 14);
        color: #fff;
        overflow-y: scroll;
    }
    .sub-apps {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
            list-style: none;
            display: inline-block;
            padding: 20px;
            cursor: pointer;
            width: 220px;
            margin: 10px 0;
            border: 1px solid #e1e1e1;
            &.active {
                color: #42b983;
                text-decoration: underline;
            }
        }
    }
}
</style>
