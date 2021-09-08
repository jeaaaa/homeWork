<template>
    <el-checkbox-group v-model="value" @input="e__input">
        <el-checkbox v-for="(v, i) in formDatas.rules.enum" :key="i" :label="v.value" :disabled="v.disabled" :border="v.border">{{
            v.label
        }}</el-checkbox>
    </el-checkbox-group>
</template>

<script>
import formBase from '../mixins/form'
export default {
    name: 'ECheckbox',
    mixins: [formBase],
    data() {
        return {}
    }
}
</script>
<style lang='scss' scoped>
</style>
