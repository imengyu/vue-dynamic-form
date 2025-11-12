<template>
  <a-select
    :value="value"
    @update:value="emits('update:value', $event)"
    :disabled="disabled"
    v-bind="customProps"
  >
    <a-select-option 
    v-for="it in options" 
    :key="it.value" 
    :value="it.value"
    >
      {{ it.label }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
/**
 * 下拉框表单控件，用于解决 a-select 不能选择对象的问题
 */
import type { SelectProps } from 'ant-design-vue';
import type { PropType } from 'vue';
import type { SelectValueOption } from './SelectValue';

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
    type: Object as PropType<SelectValueOption[]>,
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

</script>