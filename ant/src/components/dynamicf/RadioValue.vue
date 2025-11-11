<template>
  <a-radio-group 
    :value="value"
    @update:value="emit('update:value', $event)"
    :disabled="disabled"
    v-bind="customGroupProps"
  >
    <a-radio 
      v-for="it in options"
      :key="it.value"
      :value="it.value"
      v-bind="customProps"
    >
      {{it.label}}
    </a-radio>
  </a-radio-group>
</template>

<script lang="ts" setup>
/**
 * 下拉框表单控件，用于解决 a-select 不能选择对象的问题
 */
import type { RadioGroupProps, RadioProps } from 'ant-design-vue';
import { type PropType, ref, watch, onMounted } from 'vue';
import type { IDynamicFormItemRadioValueOption } from './RadioValue';

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
    type: Object as PropType<IDynamicFormItemRadioValueOption[]>,
    default: null,
  },
  value: {
  },
  customProps: {
    type: Object as PropType<RadioProps>,
    default: null,
  },
  customGroupProps: {
    type: Object as PropType<RadioGroupProps>,
    default: null,
  },
});

const emit = defineEmits([
  'update:value',
]);

</script>