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
import { BaseSelectProps, DynamicForm, IDynamicFormOptions } from '../../lib/main';
import { computed, ref } from 'vue'

const formModel = ref({
  singleObjectProp: {
    name: '',
    description: '说明文字文字文字文字文字',
    product: 0,
  },
  otherProp: '这是正常条目',
});
const formOptions : IDynamicFormOptions = {
  formLabelCol: { span: 6 },
  formWrapperCol: { span: 18 },
  formItems: [
    { type: 'base-text', label: '正常条目', name: 'otherProp' },
    { 
      type: 'object', label: '单个对象条目', name: 'singleObjectProp', 
      formProps: {
        center: false,
      },
      children: [
        { type: 'base-text', label: '名称', name: 'name', additionalProps: { placeholder: '请输入名称' } },
        { type: 'base-text', label: '说明', name: 'description', additionalProps: { placeholder: '请输入说明' } },
        { 
          type: 'base-select', label: '商品', name: 'product', 
          additionalProps: {
            options: [
              { text: '全部', value: 0 },
              { text: '苹果', value: 1 },
              { text: '香蕉', value: 2 },
              { text: '葡萄', value: 3 },
            ]
          } as BaseSelectProps
        },
      ]
    },
  ],
  formRules: {},
};

const resultJson = computed(() => {
  return JSON.stringify(formModel.value, undefined, 2);
});
</script>