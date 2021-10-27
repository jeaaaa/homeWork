import { customAlphabet } from 'nanoid'

/**
 * @description 部署应用时的基本URL
 */
export const BASE_URL = import.meta.env.BASE_URL

/**
 * @description 生成nanoid
 */
export const generateNanoid = customAlphabet('1234567890abcdef', 10)
