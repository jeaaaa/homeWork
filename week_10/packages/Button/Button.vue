<template>
    <button
        :class="[
            'el-button',
            type ? 'el-button--' + type : '',
            buttonSize ? 'el-button--' + buttonSize : '',
            {
                'is-disabled': buttonDisabled,
                'is-loading': loading,
                'is-plain': plain,
                'is-round': round,
                'is-circle': circle
            }
        ]"
        :disabled="buttonDisabled || loading"
        :autofocus="autofocus"
        :type="nativeType"
        @click="handleClick"
    >
        <i v-if="loading" class="el-icon-loading"></i>
        <i v-if="icon && !loading" :class="icon"></i>
        <span v-if="$slots.default"><slot></slot></span>
    </button>
</template>

<script lang="ts">
import { computed, inject, defineComponent } from 'vue'
import { elFormKey, elFormItemKey } from '@/tokens'
import { useGlobalConfig } from '@/utils/util'
import { elButtonGroupKey } from '@/tokens'

import { buttonEmits, buttonProps } from './button'

import type { ElFormContext, ElFormItemContext } from '@/tokens'
import '@/theme/chalk/base.scss'
import '@/theme/chalk/button.scss'

export default defineComponent({
    name: 'ElButton',

    props: buttonProps,
    emits: buttonEmits,

    setup(props, { emit }) {
        const $ELEMENT = useGlobalConfig()

        const elForm = inject<ElFormContext>(elFormKey)
        const elFormItem = inject<ElFormItemContext>(elFormItemKey)
        const elBtnGroup = inject(elButtonGroupKey)

        const buttonSize = computed(() => props.size || elBtnGroup?.size || elFormItem?.size || $ELEMENT.size)
        const buttonDisabled = computed(() => props.disabled || elForm?.disabled)

        const handleClick = (evt: MouseEvent) => emit('click', evt)

        return {
            buttonSize,
            buttonDisabled,
            handleClick
        }
    }
})
</script>
