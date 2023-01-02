---
title: 开始使用
---

<script setup>
import DynamicFormBasicUseage1 from '../../src/example/views/BasicUseageDoc1.vue'
import DynamicFormBasicUseage2 from '../../src/example/views/BasicUseageDoc2.vue'
import DynamicFormBasicUseage from '../../src/example/views/BasicUseageDoc.vue'
</script>

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

vue-dynamic-form 不带复杂的表单组件，不与任何UI库耦合。因此您可以选择安装自己喜欢的UI框架或其他库，
使用UI库的表单组件，需要将其绑定后即可在动态表单中使用。

推荐：

* [Ant Design Vue](https://www.antdv.com/docs/vue/getting-started-cn)
* [arco.design Vue](https://arco.design/vue/docs/start)
* [Element plus](https://element-plus.gitee.io/zh-CN/guide/installation.html)

你需要绑定表单组件，将其注册，请参考 [绑定组件](./register-controls.md)。

## 编写表单结构+数据

绑定组件完成后，你就可以开始写动态表单了，你需要写的有两个部分，结构 与 数据。

* 数据是你最终提交到服务端的数据。
* 结构是你渲染表单结构的数据结构。

一般的数据如下所示，你只需要将其传入 DynamicForm 的 model 属性中即可。

```js
const formModel = reactive({
  stringProp: '',
  stringProp2: '',
  numberProp: 2,
  numberProp2: 3,
  booleanProp: false,
});
```

### 表单结构

表单由 formItems 和 formRules 两部分组成，最重要的是 formItems，用于描述表单的结构。

formItems 由数组组成，每个条目表示一个表单项，例如下面的表单项显示一个 基础 input：

```ts
const formOptions = ref<IDynamicFormOptions>({
  formLabelCol: { span: 6 },
  formWrapperCol: { span: 18 },
  formItems: [
    {
      type: 'base-text',
      label: '文本',
      name: 'stringProp',
      additionalProps: { placeholder: '请输入文本' }
    },
  ]
});
```

其中：

* type 指定当前表单项使用的组件，这与你在 [绑定组件](#绑定组件) 章节中绑定时使用的名称一致。
* name 指定当前表单项绑定的数据属性，上面这个input绑定了 `formModel.stringProp` 这个属性。
* label 指定说明文字
* additionalProps 这个用于为组件设置特殊属性，这个可以传入什么属性是由你使用的组件决定的，例如 input 有 placeholder 这个属性，所以我可以覆盖这个属性，指定 input 的水印文字。
  同样的，还有 additionalEvents 用于设置或者覆盖默认事件。

最终显示效果如下所示：

<DynamicFormBasicUseage1 />

### 嵌套表单结构

表单支持嵌套，你可以嵌套对象或者数组。

具体请参考 [嵌套表单结构](./form-nest.md)。

### 表单验证

动态表单本身不提供任何验证方法，验证是由其中的 Form 组件实现的，所以 formRules 仅仅是把值传给了 Form。

动态表单内置的 Form 是使用 async-validator 进行验证的，具体验证参数请参考 [async-validator文档](https://github.com/yiminghe/async-validator)。

如果你将表单默认的 Form 替换了，传入的 formRules 请参考对应的文档。

### 表单其他属性

表单数据还支持设置 label 与 wrapper 占比。

```ts
const formOptions = ref<IDynamicFormOptions>({
  //formLabelWidth: '100px', //单独设置宽度
  formLabelCol: { span: 12 },
  formWrapperCol: { span: 12 },
  //...
});
```

效果：

<DynamicFormBasicUseage2 />

表单数据还支持设置 Form 组件的其他属性，如果你使用自定义 Form 组件，可以使用 formAdditionaProps 设置自定义属性。

```ts
const formOptions = ref<IDynamicFormOptions>({
  formAdditionaProps: {
    //自定义属性
    layout: 'inline',
  },
  //...
});
```

### 表单提交

表单可以手动验证提交，也可以通过插入一个 type="submit" 的按钮触发提交 （具体行为由你使用的 Form 组件定义）

```vue
<template>
  <div>
    <DynamicForm
      ref="formRef"
      :options="formOptions"
      :model="formModel"
      @submit="onSubmit"
    />
    <a-button type="primary" long @click="handleLogin" style="margin-top:20px">注册</a-button>
  </div>
</template>


<script setup lang="ts">
import { reactive, ref, } from 'vue'

const formRef = ref<IDynamicFormRef>();
const formModel = ref({
  //...省略
});
const formOptions : IDynamicFormOptions = {
  //...省略
};

function onSubmit() {
  //通过表单内按钮触发提交，具体行为由你使用的 Form 组件定义
  console.log('提交数据', formModel.value); 
}
function handleLogin() {
  //通过按钮手动验证，然后提交
  //这里获取了 Form 的引用，调用其验证方法，此处是一个示例。具体行为由你使用的 Form 组件定义
  (formRef.value?.getFormRef?.() as FormInstance).validate().then((res) => {
    console.log(res); 
    onSubmit();
  }).catch((e) => {
    console.log(e);
  })
}

</script>
```

## 完整的最简单 Demo

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


