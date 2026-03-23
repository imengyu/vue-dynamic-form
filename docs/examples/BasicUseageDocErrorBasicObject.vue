<template>
  <div class="example-container">
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
  </div>
</template>

<script setup lang="ts">
import { DynamicForm, type IDynamicFormOptions, defaultDynamicFormInternalWidgets } from '@imengyu/vue-dynamic-form';
import { type Ref, ref } from 'vue'

const formModel = ref('dgdfgdd') as Ref<any>;
const formOptions : IDynamicFormOptions = {
  internalWidgets: defaultDynamicFormInternalWidgets,
  formLabelCol: { span: 8 },
  formWrapperCol: { span: 16 },
  formItems: [
    { type: 'base-text', label: '名称', name: 'name', additionalProps: { placeholder: '请输入名称' } },
    { type: 'base-text', label: '说明', name: 'description', additionalProps: { placeholder: '请输入说明' } },
  ],
  formRules: {},
};
</script>