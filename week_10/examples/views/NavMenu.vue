
<template>
    <div class="page-navMenu">
        <h2>NavMenu 导航菜单</h2>
        <NavMenu></NavMenu>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { NavMenu } from "@/ele";

export default defineComponent({
    name: 'PageNavMenu',
    components: { NavMenu },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
