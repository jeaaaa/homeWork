<template>
    <el-input
        v-model="value"
        :type="formDatas.rules.type"
        :placeholder="formDatas.rules.placeholder"
        :clearable="formDatas.rules.clearable"
        :disabled="formDatas.rules.disabled"
        :maxlength="formDatas.rules.maxlength"
        :minlength="formDatas.rules.minlength"
        @input="e__input"
    ></el-input>
</template>

<script>
import formBase from '../mixins/form'
export default {
    name: 'EInput',
    mixins: [formBase],
    data() {
        return {}
    },
    watch: {}
}
</script>
<style lang='scss' scoped>
</style>
