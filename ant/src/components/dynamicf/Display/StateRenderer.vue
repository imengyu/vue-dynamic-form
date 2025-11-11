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

<script lang="ts">
import type { IDynamicFormItemSelectOption } from "@imengyu/vue-dynamic-form";
import { defineComponent, type PropType } from "vue";

export interface IStateOption extends IDynamicFormItemSelectOption {
  badgeState?: 'success' | 'processing' | 'error' | 'default' | 'warning';
  badgeColor?: string;
}

export default defineComponent({
  props: {
    value: {
    },
    stateValues: {
      type: Object as PropType<Array<IStateOption>>,
    },
  },
  computed: {
    currentState() {
      return (this.stateValues as IStateOption[])
        .find(k => k.value === this.value || k.text === this.value);
    },
  },
});
</script>