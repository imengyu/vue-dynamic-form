<template>
  <span>
    <a-badge 
      v-if="currentState"
      :status="currentState.badgeState" 
      :color="currentState.badgeColor" 
      :text="currentState.text"
    />
    <span v-else>未知状态：{{value}}</span>
  </span>
</template>

<script setup lang="ts">
import type { IDynamicFormItemSelectOption } from "@imengyu/vue-dynamic-form";
import { computed, type PropType } from "vue";

export interface IStateOption extends IDynamicFormItemSelectOption {
  badgeState?: 'success' | 'processing' | 'error' | 'default' | 'warning';
  badgeColor?: string;
}
export interface StateRendererProps {
  /**
   * 状态值列表
   */
  stateValues: Array<IStateOption>;
}

const props = defineProps<StateRendererProps & {
  value: unknown;
}>();
const currentState = computed(() => {
  return (props.stateValues as IStateOption[])
    .find(k => k.value === props.value || k.text === props.value);
});
</script>