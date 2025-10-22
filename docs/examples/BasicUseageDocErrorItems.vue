<template>
  <div class="example-container">
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
  </div>
</template>

<script setup lang="ts">
import { DynamicForm, IDynamicFormOptions, defaultDynamicFormInternalWidgets } from '@imengyu/vue-dynamic-form';
import { ref } from 'vue'

const formModel = ref({
  arr1: 3,
  arr2: null,
  obj1: '345',
  obj2: null,
  name: '',
});
const formOptions : IDynamicFormOptions = {
  internalWidgets: defaultDynamicFormInternalWidgets,
  formLabelCol: { span: 8 },
  formWrapperCol: { span: 16 },
  formItems: [
    { type: 'base-text', label: '正常条目', name: 'name', additionalProps: { placeholder: '请输入名称' } },
    { type: 'array-single', label: '错误的数组类型', name: 'arr1' },
    { type: 'array-single', label: '空的数组类型', name: 'arr2' },
    { type: 'object', label: '错误的对象类型', name: 'obj1' },
    { type: 'object', label: '空的对象类型', name: 'obj2' },
  ],
  formRules: {},
};
</script>