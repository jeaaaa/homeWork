
<template>
    <div class="page-tabs">
        <h2>Tabs 标签页</h2>
        <Tabs></Tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Tabs } from "@/ele";

export default defineComponent({
    name: 'PageTabs',
    components: { Tabs },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
