
<template>
    <div class="page-carousel">
        <h2>Carousel 走马灯</h2>
        <Carousel :interval="5000" arrow="always">
            <CarouselItem v-for="item in 4" :key="item">
                <h3>{{ item }}</h3>
            </CarouselItem>
        </Carousel>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from 'vue'
import type { PropType } from 'vue'
import { Carousel, CarouselItem } from '@/ele'

export default defineComponent({
    name: 'PageCarousel',
    components: { Carousel, CarouselItem },

    setup(props, { emit, slots }) {
        return {}
    }
})
</script>

<style>
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>