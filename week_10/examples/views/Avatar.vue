
<template>
    <div class="page-avatar">
        <h2>Avatar 头像</h2>
        <Avatar></Avatar>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Avatar } from "@/ele";

export default defineComponent({
    name: 'PageAvatar',
    components: { Avatar },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
