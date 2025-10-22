<template>
  <div>
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
  </div>
</template>

<script setup lang="ts">
import { DynamicForm, IDynamicFormObject, IDynamicFormOptions, renderTextDefaultSlot } from '@imengyu/vue-dynamic-form';
import { reactive, ref, } from 'vue'

const formModel = reactive({
  stringProp: '',
  booleanProp: false,
});
const formOptions = ref<IDynamicFormOptions>({
  formLabelCol: { span: 4 },
  formWrapperCol: { span: 20 },
  formItems: [
    {
      type: 'check-box', label: '展示更多内容', name: 'booleanProp',
      additionalSlot: {
        ...renderTextDefaultSlot('展示更多内容'),
      },
    },
    {
      hidden: { callback: (_, model) => (model as IDynamicFormObject).booleanProp == false },
      type: 'text', label: '文本', name: 'stringProp', additionalProps: { placeholder: '请输入文本' },
    },
  ],
});
</script>