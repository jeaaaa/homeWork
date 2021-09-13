
<template>
    <div class="page-table">
        <h2>Table 表格</h2>
        <Table></Table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Table } from "@/ele";

export default defineComponent({
    name: 'PageTable',
    components: { Table },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
