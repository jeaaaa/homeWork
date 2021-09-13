
<template>
    <div class="page-slider">
        <h2>Slider 滑块</h2>
        <Slider></Slider>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Slider } from "@/ele";

export default defineComponent({
    name: 'PageSlider',
    components: { Slider },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
