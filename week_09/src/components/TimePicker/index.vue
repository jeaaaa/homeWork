<template>
    <el-date-picker
        v-model="value"
        :type="formDatas.rules.type"
        :clearable="formDatas.rules.clearable"
        :placeholder="formDatas.rules.placeholder"
        :format="formDatas.rules.format"
        :value-format="formDatas.rules.valueFormat"
        :range-separator="
            formDatas.rules.type === 'daterange' || formDatas.rules.type === 'datetimerange' ? formDatas.rules.rangeSeparator || '至' : ''
        "
        :start-placeholder="
            formDatas.rules.type === 'daterange' || formDatas.rules.type === 'datetimerange' ? formDatas.rules.startPlaceholder || '开始日期' : ''
        "
        :end-placeholder="
            formDatas.rules.type === 'daterange' || formDatas.rules.type === 'datetimerange' ? formDatas.rules.endPlaceholder || '结束日期' : ''
        "
        @input="e__input"
    ></el-date-picker>
</template>

<script>
import formBase from '../mixins/form'
export default {
    name: 'ETimePicker',
    mixins: [formBase],
    data() {
        return {}
    },
    computed: {
        format() {
            let type = ''
            if (this.formDatas.rules.type === 'datetime' || this.formDatas.rules.type === 'date' || this.formDatas.rules.type === 'time') {
                type = this.formDatas.rules.format || 'yyyy-MM-dd'
            } else {
                type = this.formDatas.rules.format || 'yyyy-MM-dd HH:mm:ss'
            }
            return type
        }
    }
}
</script>
<style lang='scss' scoped>
</style>
