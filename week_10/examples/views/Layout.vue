
<template>
    <div class="page-layout">
        <h2>Layout布局</h2>
        <Layout></Layout>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Layout } from "@/ele";

export default defineComponent({
    name: 'PageLayout',
    components: { Layout },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
