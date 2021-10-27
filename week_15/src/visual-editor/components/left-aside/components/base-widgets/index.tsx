import { defineComponent, ref } from 'vue'
import { cloneDeep } from 'lodash'
import { visualConfig } from '@/visual.config'
import styles from './index.module.scss'
import { createNewBlock } from '@/visual-editor/visual-editor.utils'
import DraggableTransitionGroup from '@/visual-editor/components/simulator-editor/draggable-transition-group.vue'

export default defineComponent({
    name: 'BaseWidgets',
    label: '基本组件',
    order: 3,
    icon: 'el-icon-edit',
    setup() {
        const baseWidgets = ref(visualConfig.componentModules.baseWidgets)

        const log = (evt) => {
            window.console.log('onChange:', evt)
        }
        // 克隆组件
        const cloneDog = (comp) => {
            console.log('当前拖拽的组件：', comp)
            const newComp = cloneDeep(comp)
            return createNewBlock(newComp)
        }

        return () => (
            <>
                <DraggableTransitionGroup
                    class={styles.listGroup}
                    v-model={baseWidgets.value}
                    group={{ name: 'components', pull: 'clone', put: false }}
                    clone={cloneDog}
                    onChange={log}
                    itemKey={'key'}
                >
                    {{
                        item: ({ element }) => (
                            <div class={styles.listGroupItem} data-label={element.label}>
                                {element.preview()}
                            </div>
                        )
                    }}
                </DraggableTransitionGroup>
            </>
        )
    }
})
