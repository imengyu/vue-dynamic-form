<template>
  <a-radio-group 
    :value="value"
    @update:value="emit('update:value', $event)"
    :disabled="disabled"
    v-bind="customGroupProps"
  >
    <a-radio 
      v-for="it in loader.data.value"
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
import { useDataLoader } from '../../common/DataLoader';
import type { RadioIdFormItemProps, RadioIdOption } from './RadioId';

const props = defineProps<RadioIdFormItemProps>();
const emit = defineEmits([
  'update:value',
]);
const loader = useDataLoader<RadioIdOption[]>(async () => await props.loadData?.() || [], {
  immediate: true,
});
</script>