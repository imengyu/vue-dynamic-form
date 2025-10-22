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

const formModel = ref({});
const formOptions : IDynamicFormOptions = {
  internalWidgets: defaultDynamicFormInternalWidgets,
  formLabelCol: { span: 8 },
  formWrapperCol: { span: 16 },
  formItems: [
    { type: 'base-text', label: '正常', name: 'name', additionalProps: { placeholder: '请输入名称' } },
    { type: 'my-text', label: '缺失条目', name: 'description', additionalProps: { placeholder: '请输入说明' } },
  ],
  formRules: {},
};
</script>