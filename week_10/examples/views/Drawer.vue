
<template>
    <div class="page-drawer">
        <h2>Drawer 抽屉</h2>
        <Drawer></Drawer>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Drawer } from "@/ele";

export default defineComponent({
    name: 'PageDrawer',
    components: { Drawer },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
