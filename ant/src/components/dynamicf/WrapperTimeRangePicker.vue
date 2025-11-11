<template>
  <a-time-range-picker
    :value="value"
    @update:value="(v: unknown) => $emit('update:value', v)"
    v-bind="additionalProps"
  />
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    additionalProps: {
      type: Object as PropType<Record<string, unknown>>,
    },
    value: {
    },
  },
  emist: [
    'update:value'
  ],
});
</script>