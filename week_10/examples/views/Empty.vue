
<template>
    <div class="page-empty">
        <h2>Empty 空状态</h2>
        <Empty></Empty>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Empty } from "@/ele";

export default defineComponent({
    name: 'PageEmpty',
    components: { Empty },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
