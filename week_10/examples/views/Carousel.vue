
<template>
    <div class="page-carousel">
        <h2>Carousel 走马灯</h2>
        <Carousel height="150px">
            <Carousel-item v-for="item in 4" :key="item">
                <h3 class="small">{{ item }}</h3>
            </Carousel-item>
        </Carousel>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from 'vue'
import type { PropType } from 'vue'
import { Carousel } from '@/ele'

export default defineComponent({
    name: 'PageCarousel',
    components: { Carousel },

    setup(props, { emit, slots }) {
        return {}
    }
})
</script>

<style>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>