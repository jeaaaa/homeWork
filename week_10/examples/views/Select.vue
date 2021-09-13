
<template>
    <div class="page-select">
        <h2>Select 选择器</h2>
        <Select></Select>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Select } from "@/ele";

export default defineComponent({
    name: 'PageSelect',
    components: { Select },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
