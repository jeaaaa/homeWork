<template>
    <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/app1">About</router-link>
    </div>
    <router-view>
        <div id="micro-app"></div>
    </router-view>
    <!-- <div id="layout-wrapper">
        <div class="layout-header">头部导航</div>
        <div id="subapp-viewport"></div>
    </div> -->
</template>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
