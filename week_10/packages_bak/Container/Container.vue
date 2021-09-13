<template>
  <section class="el-container" :class="{ 'is-vertical': isVertical }">
    <slot></slot>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { Component, VNode } from 'vue'

export default defineComponent({
  name: 'ElContainer',
  props: {
    direction: {
      type: String,
      default: '',
    },
  },
