
<template>
    <div class="page-pageHeader">
        <h2>PageHeader 页头</h2>
        <PageHeader></PageHeader>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { PageHeader } from "@/ele";

export default defineComponent({
    name: 'PagePageHeader',
    components: { PageHeader },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
