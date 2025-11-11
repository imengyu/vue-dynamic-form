<template>
  <div class="vc-number-range d-flex flex-row align-items-center">
    <a-input-number placeholder="最小值" :disabled="disabled" :value="realValue[0]" @update:value="(v: number) => onUpdateValue(v, 0)" v-bind="customProps" />
    <span class="p-2">-</span>
    <a-input-number placeholder="最大值" :disabled="disabled" :value="realValue[1]" @update:value="(v: number) => onUpdateValue(v, 1)" v-bind="customProps" />
  </div>
</template>

<script lang="ts" setup>
/**
 * 下拉框表单控件，用于解决 a-select 不能选择对象的问题
 */
import { Form, type InputNumberProps } from 'ant-design-vue';
import { type PropType, ref, watch, onMounted } from 'vue';

const props = defineProps({
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * 选择值
   */
  value: {
  },
  /**
   * a-number-input 其他自定义参数
   */
  customProps: {
    type: Object as PropType<InputNumberProps>,
    default: null,
  },
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