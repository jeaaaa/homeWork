
<template>
    <div class="page-tree">
        <h2>Tree 树形控件</h2>
        <Tree></Tree>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Tree } from "@/ele";

export default defineComponent({
    name: 'PageTree',
    components: { Tree },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
