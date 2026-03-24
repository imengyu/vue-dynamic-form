<template>
  <div class="vc-number-range d-flex flex-row align-items-center">
    <a-input-number 
      :placeholder="leftPlaceholder" 
      :disabled="disabled" 
      :value="realValue[0]" 
      @update:value="(v: number) => onUpdateValue(v, 0)" v-bind="customProps" 
    />
    <span class="p-2">-</span>
    <a-input-number 
      :placeholder="rightPlaceholder" 
      :disabled="disabled" 
      :value="realValue[1]" 
      @update:value="(v: number) => onUpdateValue(v, 1)" v-bind="customProps" 
    />
  </div>
</template>

<script lang="ts" setup>
/**
 * 下拉框表单控件，用于解决 a-select 不能选择对象的问题
 */
import { Form, InputNumberInstance } from '@arco-design/web-vue';
import { ref, watch, onMounted } from 'vue';

export interface NumberRangeProps {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * a-number-input 其他自定义参数
   */
  customProps?: InputNumberInstance['$props'];
  /**
   * 最小值占位符
   */
  leftPlaceholder?: string;
  /**
   * 最大值占位符
   */
  rightPlaceholder?: string;
}

const props = withDefaults(defineProps<NumberRangeProps & {
  value: number[] | null;
}>(), {
  disabled: false,
  leftPlaceholder: '最小值',
  rightPlaceholder: '最大值',
});

const emits = defineEmits([
  'update:value',
]);

const realValue = ref<number[]>([]);
const { onFieldChange } = Form.useInjectFormItemContext();

watch(() => props.value, (v) => {
  if ((v as number[])?.length == 2)
    realValue.value = v as number[];
  else {
    if (realValue.value.length === 1 && realValue.value[0] === undefined) {
      realValue.value = [];
      emits('update:value', []);
    } else {
      realValue.value = [];
    }
  }
});
onMounted(() => {
  realValue.value = (props.value as number[])?.length == 2 ? props.value as number[] : [];
});

function onUpdateValue(v : number, index: number) {
  realValue.value[index] = v;
  if (realValue.value.length < 2)
    realValue.value.push(0);
  emits('update:value', realValue.value);
  onFieldChange();
}

</script>