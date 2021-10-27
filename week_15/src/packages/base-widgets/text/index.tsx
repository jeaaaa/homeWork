import { useGlobalProperties } from '@/hooks/useGlobalProperties'
import {
    createEditorColorProp,
    createEditorInputProp,
    createEditorSelectProp,
    createEditorInputNumberProp
} from '@/visual-editor/visual-editor.props'
import type { VisualEditorComponent } from '@/visual-editor/visual-editor.utils'
import { fontArr } from './fontArr'

export default {
    key: 'text',
    moduleName: 'baseWidgets',
    label: '文本',
    preview: () => <span>预览文本</span>,
    render: ({ props, block, styles }) => {
        const { registerRef } = useGlobalProperties()

        return () => (
            <div
                ref={(el) => registerRef(el, block._vid)}
                style={{
                    color: props.color,
                    fontSize: `${parseFloat(props.size)}px`,
                    fontFamily: props.font,
                    ...styles
                }}
            >
                {props.text || '默认文本'}
            </div>
        )
    },
    props: {
        text: createEditorInputProp({ label: '显示文本' }),
        font: createEditorSelectProp({ label: '字体设置', options: fontArr }),
        color: createEditorColorProp({ label: '字体颜色' }),
        size: createEditorInputNumberProp({
            label: '字体大小',
            defaultValue: 16
        })
    }
} as VisualEditorComponent
