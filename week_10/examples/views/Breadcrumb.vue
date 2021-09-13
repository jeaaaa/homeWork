
<template>
    <div class="page-breadcrumb">
        <h2>Breadcrumb 面包屑</h2>
        <Breadcrumb></Breadcrumb>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Breadcrumb } from "@/ele";

export default defineComponent({
    name: 'PageBreadcrumb',
    components: { Breadcrumb },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
