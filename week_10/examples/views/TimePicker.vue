
<template>
    <div class="page-timePicker">
        <h2>TimePicker 时间选择器</h2>
        <TimePicker></TimePicker>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { TimePicker } from "@/ele";

export default defineComponent({
    name: 'PageTimePicker',
    components: { TimePicker },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
