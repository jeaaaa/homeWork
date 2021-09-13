
<template>
    <div class="page-popover">
        <h2>Popover 弹出框</h2>
        <Popover></Popover>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Popover } from "@/ele";

export default defineComponent({
    name: 'PagePopover',
    components: { Popover },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
