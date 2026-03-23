<template>
  <a-checkbox 
    v-model:checked="checked" 
    v-bind="checkboxProps"
  >{{text}}</a-checkbox>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import type { CheckBoxValueProps } from "./CheckBoxValue";

const props = withDefaults(defineProps<CheckBoxValueProps & {
  value?: any;
}>(), {
  text: '',
  checkedValue: () => true,
  uncheckedValue: () => false,
  value: undefined
});

const emit = defineEmits<{
  'update:value': [value: any];
}>();
const checked = ref(false);

watch(checked, (v) => {
  emit('update:value', v ? props.checkedValue : props.uncheckedValue);
});
watch(() => props.value, (v) => {
  const newChecked = v === props.checkedValue;
  if (checked.value !== newChecked) {
    checked.value = newChecked;
  }
});

onMounted(() => {
  checked.value = props.value === props.checkedValue;
});
</script>