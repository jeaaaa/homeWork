
<template>
    <div class="page-tag">
        <h2>Tag 标签</h2>
        <Tag></Tag>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Tag } from "@/ele";

export default defineComponent({
    name: 'PageTag',
    components: { Tag },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
