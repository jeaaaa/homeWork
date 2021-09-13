
<template>
    <div class="page-datePicker">
        <h2>DatePicker 日期选择器</h2>
        <DatePicker></DatePicker>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { DatePicker } from "@/ele";

export default defineComponent({
    name: 'PageDatePicker',
    components: { DatePicker },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
