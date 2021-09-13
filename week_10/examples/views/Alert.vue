
<template>
    <div class="page-alert">
        <h2>Alert 警告</h2>
        <Alert></Alert>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Alert } from "@/ele";

export default defineComponent({
    name: 'PageAlert',
    components: { Alert },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
