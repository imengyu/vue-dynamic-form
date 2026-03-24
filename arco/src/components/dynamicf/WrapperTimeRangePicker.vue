<template>
  <a-range-picker
    v-bind="$props"
    showTime
    @update:value="(v: unknown) => $emit('update:value', v)"
  />
</template>

<script lang="ts" setup>
import type { RangePickerProps } from "@arco-design/web-vue/es/date-picker/interface";

export interface WrapperTimeRangePickerProps {
}

const props = withDefaults(defineProps<WrapperTimeRangePickerProps & RangePickerProps & {
  value?: unknown;
}>(), {
});
const emit = defineEmits([
  'update:value'
]);
</script>