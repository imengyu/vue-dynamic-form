<template>
  <a-checkbox 
    v-model:checked="checked" 
    v-bind="checkboxProps"
  >{{text}}</a-checkbox>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { CheckboxProps } from "ant-design-vue";

export default defineComponent({
  props: {
    checkboxProps: {
      type: Object as PropType<CheckboxProps>,
      default: null,
    },
    text: {
      type: String,
      default: '',
    },
    checkedValue: {
      default: true,
    },
    uncheckedValue: {
      default: false,
    },
    value: {
    },
  },
  emits: [ 'update:value' ],
  watch: {
    checked(v) {
      this.$emit('update:value', v ? this.checkedValue : this.uncheckedValue);
    },
    value(v) {
      const checked = v === this.checkedValue;
      if (this.checked != checked)
        this.checked = checked;
    },
  },
  data() {
    return {
      checked: false,
    }
  },
  mounted() {
    this.checked = this.value === this.checkedValue;
  },
});
</script>