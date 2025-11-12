<template>
  <div>
    <a-input 
      :value="value"
      @update:value="(v: string) => $emit('update:value', v)"
      :disabled="disabled"
      type="password"
      v-bind="(item?.additionalProps as {})"
    />
    <PasswordStrengthMeter v-if="showPasswordStrengthMeter" :password="(value as string)" />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import PasswordStrengthMeter from "./PasswordStrengthMeter.vue";
import type { IDynamicFormItem } from "@imengyu/vue-dynamic-form";

export interface PasswordWithStrengthInputProps {
  item?: IDynamicFormItem,
  disabled?: boolean,
  showPasswordStrengthMeter?: boolean,
  value?: string,
  additionalProps?: Record<string, unknown>,
}

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IDynamicFormItem>,
    },
    disabled: {
      type: Boolean
    },
    showPasswordStrengthMeter: {
      type: Boolean,
      default: false,
    },
    value: {},
    additionalProps: {
      type: Object as PropType<Record<string, unknown>>,
    },
  },
  emits: [
    "update:value"
  ],
  components: { PasswordStrengthMeter }
});
</script>