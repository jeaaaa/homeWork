
<template>
    <div class="page-scrollbar">
        <h2>Scrollbar 滚动条</h2>
        <Scrollbar></Scrollbar>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Scrollbar } from "@/ele";

export default defineComponent({
    name: 'PageScrollbar',
    components: { Scrollbar },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
