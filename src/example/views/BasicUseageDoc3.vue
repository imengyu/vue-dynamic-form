<template>
  <div>
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
  </div>
</template>

<script setup lang="ts">
import { DynamicForm, IDynamicFormObject, IDynamicFormOptions } from '../../lib/main';
import { reactive, ref, } from 'vue'

const formModel = reactive({
  stringProp: '',
  booleanProp: false,
});
const formOptions = ref<IDynamicFormOptions>({
  formItems: [
    {
      type: 'base-check', label: '展示更多内容', name: 'booleanProp',
      additionalProps: {
        text: '显示',
      },
    },
    {
      hidden: { callback: (_, model) => (model as IDynamicFormObject).booleanProp == false },
      type: 'base-text', label: '文本', name: 'stringProp', additionalProps: { placeholder: '请输入文本' },
    },
  ],
});
</script>