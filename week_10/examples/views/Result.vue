
<template>
    <div class="page-result">
        <h2>Result 结果</h2>
        <Result></Result>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Result } from "@/ele";

export default defineComponent({
    name: 'PageResult',
    components: { Result },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
