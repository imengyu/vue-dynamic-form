<template>
  <a-checkbox 
    :checked="checked"
    @update:checked="handleUpdate"
    :disabled="disabled"
  >
    <slot>{{text}}</slot>
  </a-checkbox>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

export interface CheckBoxIntProps {
  /**
   * 选中时的值
   */
  checkedValue?: number;
  /**
   * 未选中时的值
   */
  uncheckedValue?: number;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 复选框文本
   */
  text?: string;
  value?: any;
}

const emit = defineEmits<{
  'update:value': [value: number];
}>();
const props = withDefaults(defineProps<CheckBoxIntProps>(), {
  checkedValue: 1,
  uncheckedValue: 0,
  disabled: false,
  text: '启用',
  value: null
});

const checked = ref(false);

const loadChecked = () => {
  checked.value = props.value === props.checkedValue;
};
const handleUpdate = (v: boolean) => {
  emit('update:value', v ? props.checkedValue : props.uncheckedValue);
};

watch(() => props.value, () => {
  loadChecked();
});
watch(checked, (newVal) => {
  emit('update:value', newVal ? props.checkedValue : props.uncheckedValue);
});
onMounted(() => {
  loadChecked();
});
</script>