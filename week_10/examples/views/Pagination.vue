
<template>
    <div class="page-pagination">
        <h2>Pagination 分页</h2>
        <Pagination></Pagination>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Pagination } from "@/ele";

export default defineComponent({
    name: 'PagePagination',
    components: { Pagination },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
