
<template>
    <div class="page-collapse">
        <h2>Collapse 折叠面板</h2>
        <Collapse></Collapse>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Collapse } from "@/ele";

export default defineComponent({
    name: 'PageCollapse',
    components: { Collapse },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
