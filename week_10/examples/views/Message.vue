
<template>
    <div class="page-message">
        <h2>Message 消息提示</h2>
        <Message></Message>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Message } from "@/ele";

export default defineComponent({
    name: 'PageMessage',
    components: { Message },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
