<template>
    <el-cascader
        v-model="value"
        :options="formDatas.rules.options"
        :clearable="formDatas.rules.clearable"
        :disabled="formDatas.rules.disabled"
        :placeholder="formDatas.rules.placeholder"
        :props="formDatas.rules.expandTrigger === 'hover' ? { expandTrigger: 'hover' } : { expandTrigger: 'click' }"
        @input="e__input"
    ></el-cascader>
</template>

<script>
import formBase from '../mixins/form'
export default {
    name: 'ECascader',
    mixins: [formBase],
    data() {
        return {}
    }
}
</script>
<style lang='scss' scoped>
</style>
