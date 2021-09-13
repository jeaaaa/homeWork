
<template>
    <div class="page-timeline">
        <h2>Timeline 时间线</h2>
        <Timeline></Timeline>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Timeline } from "@/ele";

export default defineComponent({
    name: 'PageTimeline',
    components: { Timeline },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
