
<template>
    <div class="page-upload">
        <h2>Upload 上传</h2>
        <Upload></Upload>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Upload } from "@/ele";

export default defineComponent({
    name: 'PageUpload',
    components: { Upload },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
