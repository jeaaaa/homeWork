<template>
    <el-input-number
        v-model="value"
        :min="formDatas.rules.min"
        :max="formDatas.rules.max"
        :step="formDatas.rules.step"
        :disabled="formDatas.rules.disabled"
        @input="e__input"
    ></el-input-number>
</template>

<script>
import formBase from '../mixins/form'
export default {
    name: 'EInputNumber',
    mixins: [formBase],
    data() {
        return {}
    }
}
</script>
<style lang='scss' scoped>
</style>
