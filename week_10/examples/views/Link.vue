
<template>
    <div class="page-link">
        <h2>Link 文字链接</h2>
        <Link href="https://element.eleme.io" target="_blank">默认链接</Link>
        <Link type="primary">主要链接</Link>
        <Link type="success">成功链接</Link>
        <Link type="warning">警告链接</Link>
        <Link type="danger">危险链接</Link>
        <Link type="info">信息链接</Link>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from 'vue'
import type { PropType } from 'vue'
import { Link } from '@/ele'

export default defineComponent({
    name: 'PageLink',
    components: { Link },
    setup(props, { emit, slots }) {
        return {}
    }
})
</script>

<style lang="scss" scoped>
</style>
