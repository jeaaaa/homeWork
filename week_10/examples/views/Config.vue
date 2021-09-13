
<template>
    <div class="page-config">
        <h2>Config Provider</h2>
        <Config></Config>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Config } from "@/ele";

export default defineComponent({
    name: 'PageConfig',
    components: { Config },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
