
<template>
    <div class="page-divider">
        <h2>Divider 分割线</h2>
        <Divider></Divider>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Divider } from "@/ele";

export default defineComponent({
    name: 'PageDivider',
    components: { Divider },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
