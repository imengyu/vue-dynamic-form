<template>
  <div class="dynamic-form-item-container-note">
    拖拽子项到此处
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { IDynamicFormItem } from '../DynamicForm';
</script>

<style lang="scss">
.dynamic-form-item-container-note {
  background-color: var(--dynamic-form-background-color);
  color: var(--dynamic-form-text-color);
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>