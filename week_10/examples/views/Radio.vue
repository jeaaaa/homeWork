
<template>
    <div class="page-radio">
        <h2>Radio 单选框</h2>
        <Radio v-model="radio1" label="1">备选项1</Radio>
        <Radio v-model="radio1" label="2">备选项2</Radio>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from 'vue'
import type { PropType } from 'vue'
import { Radio } from '@/ele'

export default defineComponent({
    name: 'PageRadio',
    components: { Radio },
    data() {
        return {
            radio1: '1',
            radio2: '1'
        }
    },
    setup(props, { emit, slots }) {
        return {}
    }
})
</script>

<style lang="scss" scoped>
</style>
