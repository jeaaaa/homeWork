
<template>
    <div class="page-backtop">
        <h2>Backtop 回到顶部</h2>
        <Backtop></Backtop>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Backtop } from "@/ele";

export default defineComponent({
    name: 'PageBacktop',
    components: { Backtop },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
