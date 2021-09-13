
<template>
    <div class="page-calendar">
        <h2>Calendar 日历</h2>
        <Calendar></Calendar>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Calendar } from "@/ele";

export default defineComponent({
    name: 'PageCalendar',
    components: { Calendar },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
