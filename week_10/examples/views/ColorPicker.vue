
<template>
    <div class="page-colorPicker">
        <h2>ColorPicker 颜色选择器</h2>
        <ColorPicker></ColorPicker>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { ColorPicker } from "@/ele";

export default defineComponent({
    name: 'PageColorPicker',
    components: { ColorPicker },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
