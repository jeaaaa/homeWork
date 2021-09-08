<template>
    <div id="app">
        <e-form :form-datas="data" :form-data="data.component" @change="changeForm" @event="eventForm"></e-form>
    </div>
</template>

<script>
export default {
    name: 'App',
    components: {},
    data() {
        return {
            data: {
                component: [
                    {
                        key: 'text',
                        val: {
                            value: '',
                            type: 'EInput',
                            label: '输入框',
                            required: {
                                isRequired: true,
                                message: '不能为空',
                                regMatch: /^1[3|4|5|6|7|8][0-9]\d{8}$/,
                                errMsg: '请输入正确的手机号格式'
                            },
                            rules: {
                                placeholder: '我是input'
                            }
                        }
                    },
                    {
                        key: 'textarea',
                        val: {
                            value: '',
                            type: 'EInput',
                            label: '文本域',
                            rules: {
                                placeholder: '我是文本域',
                                type: 'textarea'
                            }
                        }
                    },
                    {
                        key: 'number',
                        val: {
                            value: 1,
                            type: 'EInputNumber',
                            label: '数字输入框',
                            labelWidth: '120px',
                            rules: {
                                min: 0,
                                max: 20,
                                step: 1
                            }
                        }
                    },
                    {
                        key: 'radio',
                        val: {
                            value: 1,
                            type: 'ERadio',
                            label: '单选框',
                            rules: {
                                enum: [
                                    {
                                        label: 1,
                                        value: '选项1',
                                        border: true
                                    },
                                    {
                                        label: 2,
                                        value: '选项2',
                                        disabled: true
                                    },
                                    {
                                        label: 3,
                                        value: '选项3'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        key: 'checkbox',
                        val: {
                            value: [1],
                            type: 'ECheckbox',
                            label: '多选框',
                            rules: {
                                enum: [
                                    {
                                        value: 1,
                                        label: '选项1',
                                        border: true
                                    },
                                    {
                                        value: 2,
                                        label: '选项2',
                                        disabled: true
                                    },
                                    {
                                        value: 3,
                                        label: '选项3'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        key: 'select',
                        val: {
                            value: null,
                            type: 'ESelect',
                            label: '下拉框',
                            rules: {
                                enum: [
                                    {
                                        value: 1,
                                        label: '选项1'
                                    },
                                    {
                                        value: 2,
                                        label: '选项2'
                                    },
                                    {
                                        value: 3,
                                        label: '选项3'
                                    }
                                ],
                                placeholder: '请选择',
                                clearable: true
                            }
                        }
                    },
                    {
                        key: 'cascader',
                        val: {
                            value: [],
                            type: 'ECascader',
                            label: '多级下拉框',
                            labelWidth: '100px',
                            rules: {
                                expandTrigger: 'hover',
                                clearable: true,
                                placeholder: '请选择',
                                options: [
                                    {
                                        value: '1-1',
                                        label: '一级1-1',
                                        children: [
                                            {
                                                value: '2-1',
                                                label: '一级2-1',
                                                children: [
                                                    {
                                                        value: '3-1',
                                                        label: '一级3-1'
                                                    }
                                                ]
                                            },
                                            {
                                                value: '2-2',
                                                label: '一级2-2'
                                            }
                                        ]
                                    },
                                    {
                                        value: '2-1',
                                        label: '一级2-1',
                                        children: [
                                            {
                                                value: '2-1',
                                                label: '二级2-1'
                                            },
                                            {
                                                value: '2-2',
                                                label: '二级2-2'
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        key: 'timePicker',
                        val: {
                            value: [],
                            type: 'ETimePicker',
                            label: '时间范围框',
                            labelWidth: '100px',
                            rules: {
                                type: 'datetimerange',
                                startPlaceholder: '请选择开始日期',
                                endPlaceholder: '',
                                placeholder: '请选择日期',
                                clearable: true,
                                valueFormat: 'yyyy-MM-dd',
                                format: 'yyyy-MM-dd'
                            }
                        }
                    },
                    {
                        key: 'timePicker2',
                        val: {
                            value: '',
                            type: 'ETimePicker',
                            label: '时间框',
                            labelWidth: '100px',
                            rules: {
                                type: 'date',
                                placeholder: '请选择日期',
                                clearable: true,
                                valueFormat: 'yyyy-MM-dd',
                                format: 'yyyy-MM-dd'
                            }
                        }
                    }
                ],
                formAttributes: {
                    inline: false,
                    allLabelWidth: '120px'
                }
            }
        }
    },
    methods: {
        changeForm(val) {
            console.log(val, 666666)
        },
        eventForm(val) {
            console.log(val, 888888)
        }
    }
}
</script>

<style lang="scss">
</style>
