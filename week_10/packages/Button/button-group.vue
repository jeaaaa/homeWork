<template>
    <div class="el-button-group">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent, provide, reactive, toRef } from 'vue'
import { elButtonGroupKey } from '@/tokens'
import { isValidComponentSize } from '@/utils/validators'

import type { PropType } from 'vue'
import type { ComponentSize } from '@/utils/types'

export default defineComponent({
    name: 'ElButtonGroup',
    props: {
        size: {
            type: String as PropType<ComponentSize>,
            validator: isValidComponentSize
        }
    },
    setup(props) {
        provide(
            elButtonGroupKey,
            reactive({
                size: toRef(props, 'size')
            })
        )
    }
})
</script>
