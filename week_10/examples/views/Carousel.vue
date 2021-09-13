
<template>
    <div class="page-carousel">
        <h2>Carousel 走马灯</h2>
        <Carousel></Carousel>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Carousel } from "@/ele";

export default defineComponent({
    name: 'PageCarousel',
    components: { Carousel },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
