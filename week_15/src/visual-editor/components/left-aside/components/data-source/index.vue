<template>
  <el-tabs type="border-card" stretch class="data-source">
    <el-tab-pane label="数据模型" lazy>
      <data-model />
    </el-tab-pane>
    <el-tab-pane label="数据接口" lazy>
      <data-fetch />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="tsx">
export default {
  label: '数据源',
  order: 2,
  icon: 'el-icon-data-board'
}
</script>
<script setup lang="tsx" name="基本组件">
import DataModel from './data-model.vue'
import DataFetch from './data-fetch.vue'
</script>

<style lang="scss" scoped>
.data-source :deep {
  .el-tabs__header {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .el-tabs__content {
    contain: layout;
    content-visibility: auto;
  }
}
</style>
