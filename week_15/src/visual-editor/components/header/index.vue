<template>
  <el-row type="flex" class="header">
    <el-col class="flex items-center" :span="12">
      <template v-for="(toolItem, toolIndex) in tools" :key="toolIndex">
        <div :class="[`w-1/${tools.length}`]" class="w-1/9">
          <div
            class="tool-item flex flex-col items-center cursor-pointer"
            @click="toolItem.onClick"
          >
            <i :class="toolItem.icon"></i>
            <div class="title">{{ toolItem.title }}</div>
          </div>
        </div>
      </template>
    </el-col>
  </el-row>
  <preview v-model:visible="isShowH5Preview" />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import Preview from './preview.vue'
import { useVisualData, localKey } from '@/visual-editor/hooks/useVisualData'
import { BASE_URL } from '@/visual-editor/utils'
import { useTools } from './useTools'

export default defineComponent({
  name: 'Header',
  components: { Preview },
  setup() {
    const state = reactive({
      isShowH5Preview: false
    })

    const tools = useTools()

    const { jsonData } = useVisualData()

    const runPreview = () => {
      sessionStorage.setItem(localKey, JSON.stringify(jsonData))
      localStorage.setItem(localKey, JSON.stringify(jsonData))
      state.isShowH5Preview = true
    }

    return {
      ...toRefs(state),
      BASE_URL,
      tools,
      runPreview
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  width: 100%;

  .logo {
    width: 60px;
    height: 60px;
    background-image: url('@/assets/logo.png');
    background-repeat: no-repeat;
    background-size: contain;
  }

  .tool-item {
    .title {
      margin-top: 4px;
      font-size: 12px;
    }
  }

  .el-button {
    font-size: 22px;
  }

  .right-tools > * {
    margin-left: 8px;
  }
}
</style>
