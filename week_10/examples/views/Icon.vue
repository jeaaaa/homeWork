
<template>
    <div class="page-icon">
        <h2>Icon 图标</h2>
        <Icon></Icon>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Icon } from "@/ele";

export default defineComponent({
    name: 'PageIcon',
    components: { Icon },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
