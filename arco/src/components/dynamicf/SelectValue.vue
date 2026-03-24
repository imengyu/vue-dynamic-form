<template>
  <a-select
    :value="value"
    @update:value="emits('update:value', $event)"
    :disabled="disabled"
    v-bind="customProps"
  >
    <a-option 
      v-for="it in options" 
      :key="it.value" 
      :value="it.value"
    >
      {{ it.text }}
    </a-option>
  </a-select>
</template>

<script lang="ts" setup>
/**
 * 下拉框表单控件
 */
import type { SelectValueProps } from './SelectValue';

const props = defineProps<SelectValueProps & {
  modelValue: unknown;
}>();

const emits = defineEmits([
  'update:value',
]);

</script>