
<template>
    <div class="page-checkbox">
        <h2>Checkbox 多选框</h2>
        <Checkbox></Checkbox>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Checkbox } from "@/ele";

export default defineComponent({
    name: 'PageCheckbox',
    components: { Checkbox },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
