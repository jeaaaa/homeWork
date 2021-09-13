
<template>
    <div class="page-messageBox">
        <h2>MessageBox 弹框</h2>
        <MessageBox></MessageBox>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { MessageBox } from "@/ele";

export default defineComponent({
    name: 'PageMessageBox',
    components: { MessageBox },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
