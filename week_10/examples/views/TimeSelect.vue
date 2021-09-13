
<template>
    <div class="page-timeSelect">
        <h2>TimeSelect 时间选择</h2>
        <TimeSelect></TimeSelect>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { TimeSelect } from "@/ele";

export default defineComponent({
    name: 'PageTimeSelect',
    components: { TimeSelect },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
