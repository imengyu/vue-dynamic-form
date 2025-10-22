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
import { DynamicForm, IDynamicFormOptions, defaultDynamicFormInternalWidgets } from '@imengyu/vue-dynamic-form';
import { computed, Ref, ref } from 'vue'

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

const resultJson = computed(() => {
  return JSON.stringify(formModel.value, undefined, 2);
});
</script>