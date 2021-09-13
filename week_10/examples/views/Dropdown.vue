
<template>
    <div class="page-dropdown">
        <h2>Dropdown 下拉菜单</h2>
        <Dropdown></Dropdown>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Dropdown } from "@/ele";

export default defineComponent({
    name: 'PageDropdown',
    components: { Dropdown },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
