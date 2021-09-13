
<template>
    <div class="page-image">
        <h2>Image 图片</h2>
        <Image></Image>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Image } from "@/ele";

export default defineComponent({
    name: 'PageImage',
    components: { Image },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
