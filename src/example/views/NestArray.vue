<template>
  <div>
    <div class="demo-row">
      <div class="demo-col" style="width:50%;">
        <DynamicForm
          :options="formOptions"
          :model="formModel"
          @submit="onSubmit"
        />
      </div>
      <div class="demo-col" style="width:50%;">
        <div class="demo-alert">这里是表单的 model 数据结果，你可以修改数据，将其应用到表单上，或者从表单 model 获取数据显示。看看数据的结构是如何自动处理的</div>
        <div class="demo-row">
          <button @click="onApplyClick">&lt;&lt; 应用JSON至表单 model 上</button>
          <button @click="onSubmit">&gt;&gt; 从表单 model 获取数据显示</button>
        </div>
        <div :class="'demo-alert '+(editorHasError?'error':'success')">{{  editorHasError || '格式没问题' }}</div>
        <codemirror
          v-model="editorJson"
          placeholder="请点击提交按钮获取表单提交数据"
          :style="{ height: '600px', width: '100%' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="editorExtensions"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseCheckProps, BaseSelectProps, DynamicForm, IDynamicFormOptions } from '@/lib/main';
import { onMounted, ref } from 'vue'

import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';

const editorExtensions = [json()];
const editorJson = ref('');
const editorHasError = ref('');

const formModel = ref({
  singleObjectProp: {
    name: '',
    description: '说明文字文字文字文字文字',
    product: 0,
  },
  nestedObjectProp: {
    name: '',
    description: '',
    product: {
      product_id: 0,
      enabled: false,
    },
  },
  arrayProp: [
    '我是简单数组数据'
  ],
  arrayObjectProp: [
    {
      name: '我是对象数组数据',
      value: '100',
      enabled: true,
    }
  ],
  numberProp: 2,
  numberProp2: 3,
  booleanProp: false,
});
const formOptions : IDynamicFormOptions = {
  formLabelCol: { span: 6 },
  formWrapperCol: { span: 18 },
  formItems: [
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
    { type: 'base-divider', name: 'divider1', formProps: { colon: false } },
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
    { type: 'base-divider', name: 'divider2', formProps: { colon: false } },
    { 
      type: 'array-object', label: '数组嵌套对象条目', name: 'arrayObjectProp', 
      formProps: {
        center: false,
      },
      newChildrenObject: (arrayNow) => ({
        name: `新建子条目${arrayNow.length+1}`,
        value: '100',
        enabled: false,
      }),
      children: [
        { type: 'base-text', label: '名称', name: 'name', additionalProps: { placeholder: '请输入名称' } },
        { type: 'base-text', label: '数量', name: 'value', additionalProps: { placeholder: '请输入数量' } },
        {
          type: 'base-check', label: '是否启用', name: 'enabled',
          additionalProps: {
            text: '是',
          } as BaseCheckProps,
        },
      ]
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
};

onMounted(() => {
  onSubmit();
});

function onSubmit() {
  editorJson.value = JSON.stringify(formModel.value, undefined, 2);
}
function onApplyClick() {
  try {
    const newObj = JSON.parse(editorJson.value);
    formModel.value = newObj;
    editorHasError.value = '';
  } catch (e) {
    editorHasError.value = '' + e;
  }
}
</script>