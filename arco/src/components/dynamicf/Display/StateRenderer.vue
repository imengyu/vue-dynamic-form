<template>
  <span>
    <a-badge 
      v-if="currentState"
      :status="currentStateBadgeState" 
      :color="currentState.badgeColor" 
      :text="currentState.text"
    />
    <span v-else>未知状态：{{value}}</span>
  </span>
</template>

<script setup lang="ts">
import type { IDynamicFormItemSelectOption } from "@imengyu/vue-dynamic-form";
import { computed } from "vue";

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
  return (props.stateValues as IStateOption[]).find(k => k.value === props.value || k.text === props.value);
});
const currentStateBadgeState = computed(() => {
  switch (currentState.value?.badgeState) {
    case 'default': return 'normal';
    case 'error': return 'danger';
    default: return currentState.value?.badgeState;
  }
});
</script>