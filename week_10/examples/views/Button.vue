<template>
    <div class="page-button">
        <h2>Button 按钮</h2>

        <Row>
            <Button>默认按钮</Button>
            <Button type="primary">主要按钮</Button>
            <Button type="success">成功按钮</Button>
            <Button type="info">信息按钮</Button>
            <Button type="warning">警告按钮</Button>
            <Button type="danger">危险按钮</Button>
        </Row>

        <Row>
            <Button plain>朴素按钮</Button>
            <Button type="primary" plain>主要按钮</Button>
            <Button type="success" plain>成功按钮</Button>
            <Button type="info" plain>信息按钮</Button>
            <Button type="warning" plain>警告按钮</Button>
            <Button type="danger" plain>危险按钮</Button>
        </Row>

        <Row>
            <Button round>圆角按钮</Button>
            <Button type="primary" round>主要按钮</Button>
            <Button type="success" round>成功按钮</Button>
            <Button type="info" round>信息按钮</Button>
            <Button type="warning" round>警告按钮</Button>
            <Button type="danger" round>危险按钮</Button>
        </Row>

        <br />

        <ButtonGroup>
            <Button>左</Button>
            <Button>中</Button>
            <Button>右</Button>
        </ButtonGroup>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from 'vue'
import type { PropType } from 'vue'
import { Button, ButtonGroup, Row } from '@/ele'

export default defineComponent({
    name: 'PageButton',
    components: { Button, Row },
    setup(props, { emit, slots }) {
        return {}
    }
})
</script>

<style lang="scss" scoped></style>
