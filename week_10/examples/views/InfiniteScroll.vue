
<template>
    <div class="page-infiniteScroll">
        <h2>InfiniteScroll 无限滚动</h2>
        <InfiniteScroll></InfiniteScroll>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { InfiniteScroll } from "@/ele";

export default defineComponent({
    name: 'PageInfiniteScroll',
    components: { InfiniteScroll },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
