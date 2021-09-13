
<template>
    <div class="page-notification">
        <h2>Notification 通知</h2>
        <Notification></Notification>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Notification } from "@/ele";

export default defineComponent({
    name: 'PageNotification',
    components: { Notification },
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
