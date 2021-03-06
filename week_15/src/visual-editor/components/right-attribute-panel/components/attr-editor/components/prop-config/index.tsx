import { computed, defineComponent, PropType } from 'vue'
import {
    ElColorPicker,
    ElInput,
    ElOption,
    ElSelect,
    ElSwitch,
    ElCascader,
    ElInputNumber,
    ElFormItem,
    ElPopover
} from 'element-plus'
import { useDotProp } from '@/visual-editor/hooks/useDotProp'
import { VisualEditorProps, VisualEditorPropsType } from '@/visual-editor/visual-editor.props'
import { TablePropEditor, CrossSortableOptionsEditor } from '../../components'
import { cloneDeep } from 'lodash'
import { useVisualData } from '@/visual-editor/hooks/useVisualData'
import { VisualEditorBlockData, VisualEditorComponent } from '@/visual-editor/visual-editor.utils'

export const PropConfig = defineComponent({
    props: {
        component: {
            type: Object as PropType<VisualEditorComponent>,
            default: () => ({})
        },
        block: {
            type: Object as PropType<VisualEditorBlockData>,
            default: () => ({})
        }
    },
    setup(props) {
        const { jsonData } = useVisualData()
        /**
         * @description ๆจกๅ้ๅ
         */
        const models = computed(() => cloneDeep(jsonData.models))

        const renderPropItem = (propName: string, propConfig: VisualEditorProps) => {
            const { propObj, prop } = useDotProp(props.block.props, propName)

            propObj[prop] ??= propConfig.defaultValue

            return {
                [VisualEditorPropsType.input]: () => {
                    if (!Object.is(propObj[prop], undefined) && !Object.is(propObj[prop], null)) {
                        propObj[prop] = `${propObj[prop]}`
                    }
                    return (
                        <ElInput v-model={propObj[prop]} placeholder={propConfig.tips || propConfig.label} />
                    )
                },
                [VisualEditorPropsType.inputNumber]: () => {
                    const parseRes = parseFloat(propObj[prop])
                    propObj[prop] = Number.isNaN(parseRes) ? 0 : parseRes
                    return <ElInputNumber v-model={propObj[prop]} />
                },
                [VisualEditorPropsType.switch]: () => <ElSwitch v-model={propObj[prop]} />,
                [VisualEditorPropsType.color]: () => <ElColorPicker v-model={propObj[prop]} />,
                [VisualEditorPropsType.crossSortable]: () => (
                    <CrossSortableOptionsEditor
                        v-model={propObj[prop]}
                        multiple={propConfig.multiple}
                        showItemPropsConfig={propConfig.showItemPropsConfig}
                    />
                ),
                [VisualEditorPropsType.select]: () => (
                    <ElSelect v-model={propObj[prop]} valueKey={'value'} multiple={propConfig.multiple}>
                        {propConfig.options?.map((opt) => (
                            <ElOption label={opt.label} style={{ fontFamily: opt.value }} value={opt.value} />
                        ))}
                    </ElSelect>
                ),
                [VisualEditorPropsType.table]: () => (
                    <TablePropEditor v-model={propObj[prop]} propConfig={propConfig} />
                ),
                [VisualEditorPropsType.modelBind]: () => (
                    <ElCascader
                        clearable={true}
                        props={{
                            checkStrictly: true,
                            children: 'entitys',
                            label: 'name',
                            value: 'key',
                            expandTrigger: 'hover'
                        }}
                        placeholder="่ฏท้ๆฉ็ปๅฎ็่ฏทๆฑๆฐๆฎ"
                        v-model={propObj[prop]}
                        options={models.value}
                    ></ElCascader>
                )
            }[propConfig.type]()
        }

        return () => {
            return Object.entries(props.component.props ?? {}).map(([propName, propConfig]) => (
                <>
                    <ElFormItem
                        key={props.block._vid + propName}
                        style={
                            propConfig.labelPosition == 'top'
                                ? {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start'
                                }
                                : {}
                        }
                    >
                        {{
                            label: () => (
                                <>
                                    {propConfig.tips && (
                                        <ElPopover width={200} trigger={'hover'} content={propConfig.tips}>
                                            {{
                                                reference: () => <i class={'el-icon-warning-outline'}></i>
                                            }}
                                        </ElPopover>
                                    )}
                                    {propConfig.label}
                                </>
                            ),
                            default: () => renderPropItem(propName, propConfig)
                        }}
                    </ElFormItem>
                </>
            ))
        }
    }
})
