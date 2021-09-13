
<template>
    <div class="page-cascader">
        <h2>Cascader 级联选择器</h2>
        <Cascader></Cascader>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Cascader } from "@/ele";

export default defineComponent({
    name: 'PageCascader',
    components: { Cascader },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
