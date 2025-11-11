<template>
  <a-select
    :value="value"
    @update:value="onUpdateValue"
    :disabled="disabled"
    v-bind="customProps"
  >
    <template v-if="renderOption" #option="data">
      <VNodeRenderer :render="(renderOption as any)" :data="data" />
    </template>
    <a-select-option v-for="it in options" :key="it.value" v-bind="it">
      <a-badge v-if="it.badgeColor" :color="it.badgeColor" :text="it.label" />
      <a-badge v-else-if="it.badgeState" :status="it.badgeState" :text="it.label" />
      <span v-else>{{it.label}}</span>
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
/**
 * 简单下拉框表单控件
 */
import VNodeRenderer from '../../components/VNodeRenderer.vue';
import type { SelectProps } from 'ant-design-vue/lib/vc-select';
import { type PropType } from 'vue';
import type { IDynamicFormItemSelectOption, SimpleSelectRenderOption } from './SimpleSelectFormItem';

defineProps({
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
    type: Object as PropType<IDynamicFormItemSelectOption[]>,
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
  renderOption: {
    default: null,
    type: Function as PropType<SimpleSelectRenderOption>
  },
});

const emits = defineEmits([
  'update:value',
]);

function onUpdateValue(v : unknown) {
  emits('update:value', v);
}

</script>