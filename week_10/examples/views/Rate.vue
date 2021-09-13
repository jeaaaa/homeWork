
<template>
    <div class="page-rate">
        <h2>Rate 评分</h2>
        <Rate></Rate>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Rate } from "@/ele";

export default defineComponent({
    name: 'PageRate',
    components: { Rate },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
