<template>
  <a-select
    :modelValue="selectValue"
    @update:modelValue="onUpdateValue"
    :disabled="disabled"
    v-bind="customProps"
  >
    <a-option v-for="it in options" :key="(it.value as number)" :value="(it.value as number)">
      {{it.text}}
    </a-option>
  </a-select>
</template>

<script lang="ts" setup>
/**
 * 下拉框表单控件，用于解决 a-select 不能选择对象的问题
 */
import type { SelectOption } from '@arco-design/web-vue';
import { type PropType, ref, watch, onMounted } from 'vue';
import { IDynamicFormItemSelectValueOption } from './MySelect';

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
   * a-select 其他自定义参数
   */
  customProps: {
    type: Object as PropType<SelectOption>,
    default: null,
  },
});

const emits = defineEmits([
  'update:value',
]);

const selectValue = ref<string|null>('');
const options = ref<IDynamicFormItemSelectValueOption[]>([]);

function setSelectValue() {
  selectValue.value = options.value.find(k => (k.value === props.value))?.text || null;
  if (selectValue.value === null)
    selectValue.value = options.value.find(k => (typeof k.value === typeof props.value))?.text || null;
}

watch(() => props.value, () => {
  setSelectValue();
});
onMounted(() => {
  setSelectValue();
});

function onUpdateValue(v : unknown) {
  emits('update:value', v);
}

defineExpose({
  setData(newData: IDynamicFormItemSelectValueOption[]) {
    options.value = newData;
  },
});

</script>