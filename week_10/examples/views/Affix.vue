
<template>
    <div class="page-affix">
        <h2>Affix 固钉</h2>
        <Affix></Affix>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Affix } from "@/ele";

export default defineComponent({
    name: 'PageAffix',
    components: { Affix },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
