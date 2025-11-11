<template>
  <a-checkbox 
    :checked="checked"
    @update:checked="(v: boolean) => $emit('update:value', v)"
    :disabled="disabled"
  >
    <slot>{{text}}</slot>
  </a-checkbox>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CheckBoxToInt",
  data() {
    return {
      checked: false
    }
  },
  emits: [ 'update:value' ],
  props: {
    checkedValue: {
      type: Number,
      default: 1
    },
    uncheckedValue: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '启用',
    },
    value: {
      default: null,
    }
  },
  mounted: function() {
    this.loadChecked();
  },
  watch: {
    value() { this.loadChecked(); },
    checked() { this.$emit('update:value', this.checked ? this.checkedValue : this.uncheckedValue) }
  },
  methods: {
    loadChecked() {
      this.checked = this.value == this.checkedValue;
    }
  }
});
</script>