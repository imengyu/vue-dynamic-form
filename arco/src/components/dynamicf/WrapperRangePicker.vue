<template>
  <a-range-picker
    v-bind="$props"
    @update:value="(v: unknown) => $emit('update:value', v)"
  />
</template>

<script lang="ts" setup>
import type { RangePickerProps } from '@arco-design/web-vue/es/date-picker';

export interface WrapperRangePickerProps {
}

const props = withDefaults(defineProps<WrapperRangePickerProps & RangePickerProps & {
  value?: unknown;
}>(), {
  showTime: false,
});
const emit = defineEmits([
  'update:value'
]);
</script>