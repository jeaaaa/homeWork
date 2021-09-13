
<template>
    <div class="page-descriptions">
        <h2>Descriptions 描述列表</h2>
        <Descriptions></Descriptions>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Descriptions } from "@/ele";

export default defineComponent({
    name: 'PageDescriptions',
    components: { Descriptions },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
