
<template>
    <div class="page-skeleton">
        <h2>Skeleton 骨架屏</h2>
        <Skeleton></Skeleton>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Skeleton } from "@/ele";

export default defineComponent({
    name: 'PageSkeleton',
    components: { Skeleton },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
