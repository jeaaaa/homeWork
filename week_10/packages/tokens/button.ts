import type { InjectionKey } from 'vue'

import type { ComponentSize } from '@/utils/types'

export interface ElButtonGruopContext {
    size?: ComponentSize
}

export const elButtonGroupKey: InjectionKey<ElButtonGruopContext> = Symbol()
