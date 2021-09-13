
<template>
    <div class="page-tooltip">
        <h2>Tooltip 文字提示</h2>
        <Tooltip></Tooltip>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Tooltip } from "@/ele";

export default defineComponent({
    name: 'PageTooltip',
    components: { Tooltip },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
