<template>
  <div>
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
    <textarea v-model="resultJson" class="demo-result" style="width: 100%;height: 200px;" readonly></textarea>
  </div>
</template>

<script setup lang="ts">
import { BaseCheckProps, BaseRadioProps, BaseSelectProps, BaseTextAreaProps, DynamicForm, IDynamicFormOptions } from '../../lib/main';
import { computed, reactive, ref, } from 'vue'

const resultJson = computed(() => {
  return JSON.stringify(formModel, undefined, 2);
});

const formModel = reactive({
  stringProp: '',
  stringProp2: '',
  numberProp: 2,
  numberProp2: 3,
  booleanProp: false,
});
const formOptions = ref<IDynamicFormOptions>({
  formLabelCol: { span: 6 },
  formWrapperCol: { span: 18 },
  formItems: [
    { type: 'base-text', label: '文本', name: 'stringProp', additionalProps: { placeholder: '请输入文本' } },
    { 
      type: 'base-textarea', label: '文本域', name: 'stringProp2', 
      formProps: {
        center: false,
      },
      additionalProps: { 
        placeholder: '请输入文本域',
        rows: 6,
        cols: 100,
        style: { width: '400px' }
      } as BaseTextAreaProps
    },
    { 
      type: 'base-select', label: '选择', name: 'numberProp', 
      additionalProps: {
        options: [
          { text: '苹果', value: 1 },
          { text: '香蕉', value: 2 },
          { text: '葡萄', value: 3 },
        ]
      } as BaseSelectProps
    },
    {
      type: 'base-check', label: '复选框', name: 'booleanProp',
      additionalProps: {
        text: '我是复选框的说明',
      } as BaseCheckProps,
    },
    { 
      type: 'base-radio', label: '单选框', name: 'numberProp2', 
      additionalProps: {
        items: [
          { label: '苹果', value: 1 },
          { label: '香蕉', value: 2 },
          { label: '葡萄', value: 3 },
        ]
      } as BaseRadioProps,
    },
    { 
      type: 'base-button', label: '提交', name: 'submit',
    },
  ],
  formRules: {
    stringProp: [
      { required: true, message: '请输入文本' },
      { max: 20, message: '文本最长20个字符' },
    ],
    stringProp2: [
      { required: true, message: '请输入文本域' },
      { max: 200, message: '文本域最长200个字符' },
    ],
  },
});
</script>