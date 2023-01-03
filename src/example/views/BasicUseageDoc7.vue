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
import { BaseCheckProps, BaseSelectProps, DynamicForm, IDynamicFormOptions } from '../../lib/main';
import { computed, ref } from 'vue'

const formModel = ref({
  nestedObjectProp: {
    name: '',
    description: '',
    product: {
      product_id: 0,
      enabled: false,
    },
  },
});
const formOptions : IDynamicFormOptions = {
  formLabelCol: { span: 6 },
  formWrapperCol: { span: 18 },
  formItems: [
    { 
      type: 'object', label: '对象嵌套对象条目(这是一级对象)', name: 'nestedObjectProp', 
      formProps: {
        center: false,
      },
      children: [
        { type: 'base-text', label: '名称', name: 'name', additionalProps: { placeholder: '请输入名称' } },
        { type: 'base-text', label: '说明', name: 'description', additionalProps: { placeholder: '请输入说明' } },
        { 
          type: 'object', label: '商品信息(这是二级对象)', name: 'product', 
          formProps: {
            center: false,
          },
          childrenColProps: {
            span: 24
          },
          children: [
            { 
              type: 'base-select', label: '商品信息-商品', name: 'product_id', 
              additionalProps: {
                options: [
                  { text: '全部', value: 0 },
                  { text: '苹果', value: 1 },
                  { text: '香蕉', value: 2 },
                  { text: '葡萄', value: 3 },
                ]
              } as BaseSelectProps
            },
            {
              type: 'base-check', label: '商品信息-是否启用', name: 'enabled',
              additionalProps: {
                text: '是',
              } as BaseCheckProps,
            },
          ]
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