<template>
  <div>
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
    <textarea v-model="resultJson" class="demo-result" style="width: 100%;height: 150px;" readonly></textarea>
  </div>
</template>

<script setup lang="ts">
import { DynamicForm, FormItemProps, IDynamicFormOptions } from '../../lib/main';
import { computed, ref } from 'vue'

const formModel = ref({
  stringProp0: '',
  stringProp1: '',
  stringProp2: '',
  stringProp3: '',
});
const formOptions : IDynamicFormOptions = {
  formLabelCol: { span: 4 },
  formWrapperCol: { span: 20 },
  formItems: [
    { type: 'base-text', label: '文本', name: 'stringProp0', additionalProps: { placeholder: '请输入文本' } },
    { type: 'base-text', label: '文本', name: 'stringProp1', additionalProps: { placeholder: '请输入文本' } },
    {
      type: 'simple-flat', label: '横向', name: 'horz_test',
      childrenColProps: { span: 12 },
      children: [
        {
          type: 'base-text',
          label: '文本',
          name: 'stringProp2',
          additionalProps: { placeholder: '请输入文本' },
          formProps: {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
            noBottomMargin: true,
          } as FormItemProps,
        },
        {
          type: 'base-text',
          label: '文本',
          name: 'stringProp3',
          additionalProps: { placeholder: '请输入文本' },
          formProps: {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
            noBottomMargin: true,
          } as FormItemProps,
        },
      ],
    },
  ],
  formRules: {},
};

const resultJson = computed(() => {
  return JSON.stringify(formModel.value, undefined, 2);
});
</script>