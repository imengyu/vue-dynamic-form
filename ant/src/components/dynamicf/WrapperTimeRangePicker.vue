<template>
  <a-time-range-picker
    v-bind="$props"
    @update:value="(v: unknown) => $emit('update:value', v)"
  />
</template>

<script lang="ts" setup>
import { defineComponent, type PropType } from "vue";
import type { TimeRangePickerProps } from "ant-design-vue/es/time-picker";

export interface WrapperTimeRangePickerProps {
}

const props = withDefaults(defineProps<WrapperTimeRangePickerProps & TimeRangePickerProps & {
  value?: unknown;
}>(), {
});
const emit = defineEmits([
  'update:value'
]);
</script>