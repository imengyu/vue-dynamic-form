<template>
  <a-select
    :value="selectValue"
    @update:value="onUpdateValue"
    :disabled="disabled"
    v-bind="customProps"
  >
    <a-select-option v-for="it in options" :key="it.text" :value="it.text">
      {{it.text}}
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
/**
 * 下拉框表单控件，用于解决 a-select 不能选择对象的问题
 */
import type { SelectProps } from 'ant-design-vue/lib/vc-select';
import { type PropType, ref, watch, onMounted } from 'vue';
import type { IDynamicFormItemSelectValueOption } from './SelectValue';

const props = defineProps({
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * 选项数据
   */
  options: {
    type: Object as PropType<IDynamicFormItemSelectValueOption[]>,
    default: null,
  },
  /**
   * 选择值
   */
  value: {
  },
  /**
   * a-select 其他自定义参数
   */
  customProps: {
    type: Object as PropType<SelectProps>,
    default: null,
  },
});

const emits = defineEmits([
  'update:value',
]);

const selectValue = ref<string|null>('');

function setSelectValue() {
  selectValue.value = props.options.find(k => (k.value === props.value))?.text || null;
  if (selectValue.value === null)
    selectValue.value = props.options.find(k => (typeof k.value === typeof props.value))?.text || null;
}

watch(() => props.value, () => {
  setSelectValue();
});
onMounted(() => {
  setSelectValue();
});

function onUpdateValue(v : unknown) {
  emits('update:value', props.options.find(k => k.text === v)?.value);
}

</script>