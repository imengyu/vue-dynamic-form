<template>
  <a-radio-group 
    :value="value"
    @update:value="emit('update:value', $event)"
    :disabled="disabled"
    v-bind="customGroupProps"
  >
    <a-radio 
      v-for="it in options"
      :key="it.value"
      :value="it.value"
      v-bind="customProps"
    >
      {{it.text}}
    </a-radio>
  </a-radio-group>
</template>

<script lang="ts" setup>
/**
 * 下拉框表单控件，用于解决 a-select 不能选择对象的问题
 */
import type { RadioValueFormItemProps } from './RadioValue';

const props = defineProps<RadioValueFormItemProps>();
const emit = defineEmits([
  'update:value',
]);

</script>