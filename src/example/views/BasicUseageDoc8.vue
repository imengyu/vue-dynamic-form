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
import { DynamicForm, IDynamicFormOptions } from '../../lib/main';
import { computed, ref } from 'vue'

const formModel = ref({
  arrayProp: [
    '我是简单数组数据'
  ],
});
const formOptions : IDynamicFormOptions = {
  formLabelCol: { span: 6 },
  formWrapperCol: { span: 18 },
  formItems: [
    { 
      type: 'array-single', label: '数组单个元素条目', name: 'arrayProp', 
      formProps: {
        center: false,
      },
      newChildrenObject: (arrayNow) => `新建数据项${arrayNow.length+1}`,
      children: [
        { type: 'base-text', label: '名称', name: '.', additionalProps: { placeholder: '请输入名称' } },
      ]
    },
  ],
  formRules: {},
};

const resultJson = computed(() => {
  return JSON.stringify(formModel.value, undefined, 2);
});
</script>