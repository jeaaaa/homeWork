
<template>
    <div class="page-steps">
        <h2>Steps 步骤条</h2>
        <Steps></Steps>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Steps } from "@/ele";

export default defineComponent({
    name: 'PageSteps',
    components: { Steps },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
