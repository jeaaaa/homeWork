
<template>
    <div class="page-checkbox">
        <h2>Checkbox 多选框</h2>
        <Checkbox v-model="checked1" label="备选项1"></Checkbox>
        <Checkbox v-model="checked2" label="备选项2"></Checkbox>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from 'vue'
import type { PropType } from 'vue'
import { Checkbox } from '@/ele'

export default defineComponent({
    name: 'PageCheckbox',
    components: { Checkbox },
    data() {
        return {
            checked1: true,
            checked2: false
        }
    },
    setup(props, { emit, slots }) {
        return {}
    }
})
</script>

<style lang="scss" scoped>
</style>
