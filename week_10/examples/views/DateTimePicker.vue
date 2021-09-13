
<template>
    <div class="page-dateTimePicker">
        <h2>DateTimePicker 日期时间选择器</h2>
        <DateTimePicker></DateTimePicker>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { DateTimePicker } from "@/ele";

export default defineComponent({
    name: 'PageDateTimePicker',
    components: { DateTimePicker },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
