
<template>
    <div class="page-input">
        <h2>Input 输入框</h2>
        <Input></Input>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Input } from "@/ele";

export default defineComponent({
    name: 'PageInput',
    components: { Input },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
