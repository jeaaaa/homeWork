
<template>
    <div class="page-dialog">
        <h2>Dialog 对话框</h2>
        <Dialog></Dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Dialog } from "@/ele";

export default defineComponent({
    name: 'PageDialog',
    components: { Dialog },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
