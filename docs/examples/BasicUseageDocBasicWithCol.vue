<template>
  <div>
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
  </div>
</template>

<script setup lang="ts">
import { DynamicForm, IDynamicFormOptions, defaultDynamicFormInternalWidgets } from '@imengyu/vue-dynamic-form';
import { reactive, ref, } from 'vue'

const formModel = reactive({
  stringProp: '',
  stringProp2: '',
  numberProp: 2,
  numberProp2: 3,
  booleanProp: false,
});
const formOptions = ref<IDynamicFormOptions>({
  internalWidgets: defaultDynamicFormInternalWidgets,
  formLabelCol: { span: 12 },
  formWrapperCol: { span: 12 },
  formItems: [
    { type: 'base-text', label: '文本', name: 'stringProp', additionalProps: { placeholder: '请输入文本' } },
  ],
});
</script>