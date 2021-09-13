
<template>
    <div class="page-radio">
        <h2>Radio 单选框</h2>
        <Radio></Radio>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Radio } from "@/ele";

export default defineComponent({
    name: 'PageRadio',
    components: { Radio },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
