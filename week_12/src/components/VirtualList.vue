<template>
    <div class="wrap" ref="wrap" @scroll="scrollFn">
        <div ref="scrollHeight"></div>
        <div class="visible-wrap" :style="{ transform: `translateY(${offset}px)` }">
            <div v-for="item in visibleData" :key="item.id" :id="item.id" ref="items">
                <slot :item="item"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import throttle from 'lodash/throttle'
export default {
    name: 'VirtualList',
    props: {
        size: Number,
        keeps: Number,
        arrayData: Array,
        variable: Boolean
    },
    data() {
        return {
            start: 0,
            end: this.keeps,
            offset: 0
        }
    },
    computed: {
        visibleData() {
            const prevCount = Math.min(this.start, this.keeps)
            this.prevCount = prevCount
            const renderStart = this.start - prevCount
            const nextCount = Math.min(this.arrayData.length - this.end, this.keeps)
            const renderEnd = this.end + nextCount
            return this.arrayData.slice(renderStart, renderEnd)
        }
    },
    created() {
        this.scrollFn = throttle(this.handleScroll, 200, { leading: false })
    },
    mounted() {
        // 计算列表如果全部渲染应该有的高度
        this.$refs.scrollHeight.style.height = this.arrayData.length * this.size + 'px'
        this.cacheListPosition()
    },
    updated() {
        this.$nextTick(() => {
            const domArr = this.$refs.items
            if (!(domArr && domArr.length > 0)) return
            domArr.forEach((item) => {
                const { height } = item.getBoundingClientRect()
                const id = item.getAttribute('id')
                const oldHeight = this.positionListArr[id].height
                const difference = oldHeight - height
                if (difference) {
                    this.positionListArr[id].height = height
                    this.positionListArr[id].bottom = this.positionListArr[id].bottom - difference
                    for (let i = id + 1; i < this.positionListArr.length; i++) {
                        if (this.positionListArr[i]) {
                            this.positionListArr[i].top = this.positionListArr[i - 1].bottom
                            this.positionListArr[i].bottom = this.positionListArr[i].bottom - difference
                        }
                    }
                }
            })
            // 重新计算列表如果全部渲染应该有的高度
            this.$refs.scrollHeight.style.height = this.positionListArr[this.positionListArr.length - 1].bottom + 'px'
        })
    },
    methods: {
        handleScroll() {
            const scrollTop = this.$refs.wrap.scrollTop
            if (this.variable) {
                // 每一项高度不固定
                this.start = this.getStartIndex(scrollTop)
                this.end = this.start + this.keeps
                this.offset = this.positionListArr[this.start - this.prevCount] ? this.positionListArr[this.start - this.prevCount].top : 0
            } else {
                // 每一项高度固定
                this.start = Math.ceil(scrollTop / this.size) - 1 >= 0 ? Math.ceil(scrollTop / this.size) - 1 : 0
                this.end = this.start + this.keeps
                this.offset = (this.start - this.prevCount) * this.size
            }
        },

        getStartIndex(scrollTop) {
            // 用二分法查找滚动距离是 positionListArr 哪一项的 bottom 的值
            let start = 0,
                end = this.positionListArr.length - 1,
                temp = null
            while (start <= end) {
                let midIndex = parseInt(start + (end - start) / 2),
                    midVal = this.positionListArr[midIndex].bottom
                if (scrollTop === midVal) {
                    return midIndex + 1
                } else if (scrollTop < midVal) {
                    end = midIndex - 1
                    if (temp === null || temp > midIndex) temp = midIndex
                } else if (scrollTop > midVal) {
                    start = midIndex + 1
                    if (temp === null || temp < midIndex) temp = midIndex
                }
            }
            return temp
        },

        cacheListPosition() {
            this.positionListArr = this.arrayData.map((item, index) => ({
                height: this.size,
                top: index * this.size,
                bottom: (index + 1) * this.size
            }))
        }
    }
}
</script>


<style scoped lang="less">
.wrap {
    position: relative;
    overflow-y: scroll;
    height: 100vh;
    &::-webkit-scrollbar {
        display: none;
    }
}

.visible-wrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}
</style>
