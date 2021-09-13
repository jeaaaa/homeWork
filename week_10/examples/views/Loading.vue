
<template>
    <div class="page-loading">
        <h2>Loading 加载</h2>
        <Loading></Loading>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Loading } from "@/ele";

export default defineComponent({
    name: 'PageLoading',
    components: { Loading },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
