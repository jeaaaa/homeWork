
<template>
    <div class="page-card">
        <h2>Card 卡片</h2>
        <Card></Card>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Card } from "@/ele";

export default defineComponent({
    name: 'PageCard',
    components: { Card },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
