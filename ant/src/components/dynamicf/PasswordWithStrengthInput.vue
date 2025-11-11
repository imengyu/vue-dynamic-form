<template>
  <div>
    <a-input 
      :value="value"
      @update:value="(v: string) => $emit('update:value', v)"
      :disabled="disabled"
      type="password"
      v-bind="(item?.additionalProps as {})"
    />
    <PasswordStrengthMeter :password="(value as string)" />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import PasswordStrengthMeter from "./PasswordStrengthMeter.vue";
import type { IDynamicFormItem } from "@imengyu/vue-dynamic-form";

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IDynamicFormItem>,
    },
    disabled: {
      type: Boolean
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