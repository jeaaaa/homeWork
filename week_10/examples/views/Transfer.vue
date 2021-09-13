
<template>
    <div class="page-transfer">
        <h2>Transfer 穿梭框</h2>
        <Transfer></Transfer>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Transfer } from "@/ele";

export default defineComponent({
    name: 'PageTransfer',
    components: { Transfer },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
