---
title: 开始使用
---

# 开始使用

## 安装

安装 vue-dynamic-form 核心

```shell
# npm 
npm i @imengyu/vue-dynamic-form

# or yarn
yarn add @imengyu/vue-dynamic-form
```

## 绑定组件

vue-dynamic-form 不带复杂的表单组件，不与任何UI库耦合。

vue-dynamic-form 只附带有基础的 Form，无法满足您的业务需求，因此您可以选择安装这些UI库或其他库，
使用这些UI库的表单组件，将其绑定后即可在动态表单中使用。

推荐：

* [Ant Design Vue](https://www.antdv.com/docs/vue/getting-started-cn)
* [arco.design Vue](https://arco.design/vue/docs/start)
* [Element plus](https://element-plus.gitee.io/zh-CN/guide/installation.html)

你需要绑定表单组件，将其注册，请参考 [绑定组件](./register-controls.md)。

## 最简 demo

<script setup>
import DynamicFormBasicUseage from '../../src/example/views/BasicUseageDoc.vue'
</script>

<DynamicFormBasicUseage />

```vue
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
import { BaseCheckProps, BaseRadioProps, BaseSelectProps, BaseTextAreaProps, DynamicForm, IDynamicFormOptions } from '@imengyu/vue-dynamic-form';
import { reactive, ref, } from 'vue'

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
```

## 高级用法


