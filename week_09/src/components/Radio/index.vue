<template>
    <el-radio-group v-model="value" @input="e__input">
        <el-radio v-for="(v, i) in formDatas.rules.enum" :key="i" :label="v.label" :disabled="v.disabled" :border="v.border">{{ v.value }}</el-radio>
    </el-radio-group>
</template>

<script>
import formBase from '../mixins/form'
export default {
    name: 'ERadio',
    mixins: [formBase],
    data() {
        return {}
    }
}
</script>
<style lang='scss' scoped>
</style>
