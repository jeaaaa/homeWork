
<template>
    <div class="page-space">
        <h2>Space 间距</h2>
        <Space></Space>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Space } from "@/ele";

export default defineComponent({
    name: 'PageSpace',
    components: { Space },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
