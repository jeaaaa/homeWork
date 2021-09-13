<template>
    <div class="el-button-group">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent, provide, reactive, toRef } from 'vue'
import { ButtonGroupKey } from '@/sharded/constants'
import { isValidComponentSize } from '@/sharded/utils'

import type { PropType } from 'vue'
import type { ComponentSize } from '@/sharded/utils'

export default defineComponent({
    name: 'ButtonGroup',
    props: {
        size: {
            type: String as PropType<ComponentSize>,
            validator: isValidComponentSize
        }
    },
    setup(props) {
        provide(
            ButtonGroupKey,
            reactive({
                size: toRef(props, 'size')
            })
        )
    }
})
</script>
