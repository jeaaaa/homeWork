
<template>
    <div class="page-inputNumber">
        <h2>InputNumber 计数器</h2>
        <InputNumber></InputNumber>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { InputNumber } from "@/ele";

export default defineComponent({
    name: 'PageInputNumber',
    components: { InputNumber },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
