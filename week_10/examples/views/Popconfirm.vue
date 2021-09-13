
<template>
    <div class="page-popconfirm">
        <h2>Popconfirm 气泡确认框</h2>
        <Popconfirm></Popconfirm>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Popconfirm } from "@/ele";

export default defineComponent({
    name: 'PagePopconfirm',
    components: { Popconfirm },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
