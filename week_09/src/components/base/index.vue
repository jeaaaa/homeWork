<template>
    <div>
        <draggable v-model="formData" @end="dragEnd">
            <transition-group>
                <template v-for="(item, index) in formData">
                    <el-form
                        :ref="'form-' + item.key"
                        :key="item.key"
                        :model="item.val"
                        :inline="formDatas.formAttributes.inline"
                        :label-width="formDatas.formAttributes.allLabelWidth"
                        :style="formDatas.formAttributes.inline ? 'height: 70px;float: left' : ''"
                    >
                        <el-form-item
                            :index="index"
                            :label="item.val.label"
                            :label-width="item.val.labelWidth"
                            :rules="
                                item.val.required
                                    ? [
                                          { required: item.val.required.isRequired, message: item.val.required.message },
                                          {
                                              validator: function (rule, value, callback) {
                                                  if (!item.val.required.regMatch.test(value)) {
                                                      callback(item.val.required.errMsg)
                                                  } else {
                                                      callback()
                                                  }
                                              }
                                          }
                                      ]
                                    : null
                            "
                            prop="value"
                        >
                            <component
                                :is="item.val.type"
                                :value="item.val.value"
                                :form-datas="{
                                    ...item.val,
                                    name: item.key,
                                    index
                                }"
                                @input="_updateFormValues"
                                @event="$emit('event', $event)"
                            ></component>
                        </el-form-item>
                    </el-form>
                </template>
            </transition-group>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import EInput from '../Input'
import EInputNumber from '../InputNumber'
import ERadio from '../Radio'
import ECheckbox from '../Checkbox'
import ESelect from '../Select'
import ECascader from '../Cascader'
import ETimePicker from '../TimePicker'

export default {
    name: 'EForm',
    components: {
        draggable,
        EInput,
        EInputNumber,
        ERadio,
        ECheckbox,
        ESelect,
        ECascader,
        ETimePicker
    },
    props: {
        formDatas: {
            type: Object,
            default: () => {}
        },
        formData: {
            type: Array,
            default: () => []
        }
    },

    watch: {
        formData: {
            deep: true,
            immediate: true,
            handler() {
                // console.log(item.val, 999999)
            }
        }
    },
    methods: {
        _updateFormValues(key, val) {
            console.log(key, val)
            this.$set(this.formData[key].val, 'value', val)
            this.$emit('change', val)
        },
        dragEnd() {
            // console.log(this.formData)
        }
    }
}
</script>
<style lang='scss' scoped>
</style>
