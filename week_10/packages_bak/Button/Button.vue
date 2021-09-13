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
import { FormKey, FormItemKey } from '@/sharded/constants'
import { useGlobalConfig } from '@element-plus/utils/util'
import type { PropType } from 'vue'
import type { ButtonNativeType, ButtonType } from './types'

export default defineComponent({
  name: 'Button',
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: 'default',
      validator: (val: string) => {
        return [
          'default',
          'primary',
          'success',
          'warning',
          'info',
          'danger',
          'text',
        ].includes(val)
      },
    },
    size: {
      type: String as PropType<ComponentSize>,
      validator: isValidComponentSize,
    },
    icon: {
      type: String,
      default: '',
    },
    nativeType: {
      type: String as PropType<ButtonNativeType>,
      default: 'button',
      validator: (val: string) => {
        return ['button', 'submit', 'reset'].includes(val)
      },
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
  },

  setup(props, { emit }) {

    const $ELEMENT = useGlobalConfig()
    const elFormItem = inject(FormKey, {} as ElFormItemContext)
    const elBtnGroup = inject(FormItemKey, {})

    const buttonSize = computed(() => {
      return props.size || elBtnGroup.size || elFormItem.size || $ELEMENT.size
    })

    //methods
    const handleClick = (evt: MouseEvent) => {
      emit('click', evt)
    }

    return {
      handleClick,
    }
  }
}
</script>
