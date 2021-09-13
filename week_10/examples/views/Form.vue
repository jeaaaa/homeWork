
<template>
    <div class="page-form">
        <h2>Form 表单</h2>
        <Form></Form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Form } from "@/ele";

export default defineComponent({
    name: 'PageForm',
    components: { Form },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
