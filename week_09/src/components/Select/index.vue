<template>
    <el-select v-model="value" :placeholder="formDatas.rules.placeholder" :clearable="formDatas.rules.clearable" @input="e__input">
        <el-option v-for="item in formDatas.rules.enum" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
</template>

<script>
import formBase from '../mixins/form'
export default {
    name: 'ESelect',
    mixins: [formBase],
    data() {
        return {}
    }
}
</script>
<style lang='scss' scoped>
</style>
