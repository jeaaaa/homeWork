
<template>
    <div class="page-progress">
        <h2>Progress 进度条</h2>
        <Progress></Progress>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Progress } from "@/ele";

export default defineComponent({
    name: 'PageProgress',
    components: { Progress },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
