# 表单嵌套

<script>
import DynamicFormBasicUseage6 from '../examples/BasicUseageDoc6.vue'
import DynamicFormBasicUseage7 from '../examples/BasicUseageDoc7.vue'
</script>

在表单中经常会遇到对象与数组这种嵌套的结构，在之前的手动表单写法中，经常需要自己处理，当数据结构特别复杂的时候，这真的是一个非常麻烦的事情。所以，vue-dynamic-form 支持为你处理对象与数组的嵌套表单。

## 嵌套对象

假设现在有一个对象：

```js
{
  singleObjectProp: {
    name: '',
    description: '说明文字文字文字文字文字',
    product: 0,
  },
  //省略其他属性...
}
```

需要编辑其中的 singleObjectProp 对象，然后需要保证每个属性有单独的条目进行编辑，你可以
使用 'object' 条目类型，填写 children ，每个 children 都会自动按照对应的 name 属性名称编辑这个对象的属性。

```ts
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
  ]
};
```

效果：

<DynamicFormBasicUseage6 />

## 嵌套对象...对象

同理，你也可以在对象中再套对象，这可以无限嵌套（但不建议嵌套过多层，会让用户难以分辨），
每一级对象属性会按照你组织的结构自动对应到指定的表单项组件上。

```ts
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
  formLabelCol: { span: 8 },
  formWrapperCol: { span: 16 },
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
```

效果：

<DynamicFormBasicUseage7 />

## 嵌套基本数组

提交数组数据是表单中经常遇到的事情，因此你可以在表单中定义一个数组类型，只需要使用 `'array-single'` 类型，它会自动为你添加数组的功能，包括添加、删除、上移、下移。

注意，children 数组只能提供一个组件，多余的会被忽略。

数组类型必须提供一个 newChildrenObject 回调，用于添加按钮添加数据，如果不提供，则没有添加按钮。

```vue preview
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
import { computed, ref } from 'vue'

const formModel = ref({
  arrayProp: [
    '我是简单数组数据'
  ],
});
const formOptions : IDynamicFormOptions = {
  internalWidgets: defaultDynamicFormInternalWidgets,
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
```

你可以指定 additionalProps 控制 添加、删除、上移/下移 按钮是否显示：

```ts
import { FormArrayGroupProps } from '@imengyu/vue-dynamic-form';

{ 
  type: 'array-single', label: '数组单个元素条目', name: 'arrayProp', 
  additionalProps: {
    showAddButton: true, //是否显示添加按钮
    showUpDownButton: true, //是否显示上移/下移按钮
    showDeleteButton: true, //是否显示删除按钮
  } as FormArrayGroupProps,
  //省略...
},
```

## 嵌套对象数组

数组中除了基本类型，也可以编辑一个对象，只需要使用 `'array-object'` 类型。

children 数组可以提供一个或者多个组件，每个 children 都会自动按照 name 编辑对应对象的属性。

```vue preview
<template>
  <div>
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
    <textarea v-model="resultJson" class="demo-result" style="width: 100%;height: 300px;" readonly></textarea>
  </div>
</template>

<script setup lang="ts">
import { BaseCheckProps, DynamicForm, IDynamicFormOptions, defaultDynamicFormInternalWidgets } from '@imengyu/vue-dynamic-form';
import { computed, ref } from 'vue'

const formModel = ref({
  arrayObjectProp: [
    {
      name: '我是对象数组数据',
      value: '100',
      enabled: true,
    }
  ],
});
const formOptions : IDynamicFormOptions = {
  internalWidgets: defaultDynamicFormInternalWidgets,
  formLabelCol: { span: 8 },
  formWrapperCol: { span: 16 },
  formItems: [
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
  ],
  formRules: {},
};

const resultJson = computed(() => {
  return JSON.stringify(formModel.value, undefined, 2);
});
</script>
```

## 其他嵌套模式

### simple-flat

类似 object 但是它的子表单读取的是父级对象的属性而不是当前的，因此 flat 模式经常用于展平对象。

你还可以指定子表单的布局模式，把它当作一个容器使用，例如，下面的例子把两个属性横向显示：

```vue preview
<template>
  <div>
    <DynamicForm
      :options="formOptions"
      :model="formModel"
    />
    <textarea v-model="resultJson" class="demo-result" style="width: 100%;height: 150px;" readonly></textarea>
  </div>
</template>

<script setup lang="ts">
import { DynamicForm, FormItemProps, IDynamicFormOptions, defaultDynamicFormInternalWidgets } from '@imengyu/vue-dynamic-form';
import { computed, ref } from 'vue'

const formModel = ref({
  stringProp0: '',
  stringProp1: '',
  stringProp2: '',
  stringProp3: '',
});
const formOptions : IDynamicFormOptions = {
  internalWidgets: defaultDynamicFormInternalWidgets,
  formLabelCol: { span: 4 },
  formWrapperCol: { span: 20 },
  formItems: [
    { type: 'base-text', label: '文本', name: 'stringProp0', additionalProps: { placeholder: '请输入文本' } },
    { type: 'base-text', label: '文本', name: 'stringProp1', additionalProps: { placeholder: '请输入文本' } },
    {
      type: 'simple-flat', label: '横向', name: 'horz_test',
      childrenColProps: { span: 12 },
      children: [
        {
          type: 'base-text',
          label: '文本',
          name: 'stringProp2',
          additionalProps: { placeholder: '请输入文本' },
          formLabelCol: { span: 8 },
          formWrapperCol: { span: 12 },
          formProps: {
            noBottomMargin: true,
          } as FormItemProps,
        },
        {
          type: 'base-text',
          label: '文本',
          name: 'stringProp3',
          additionalProps: { placeholder: '请输入文本' },
          formLabelCol: { span: 8 },
          formWrapperCol: { span: 12 },
          formProps: {
            noBottomMargin: true,
          } as FormItemProps,
        },
      ],
    },
  ],
  formRules: {},
};

const resultJson = computed(() => {
  return JSON.stringify(formModel.value, undefined, 2);
});
</script>
```

### group-object

同 object，但是会在外层添加一个外壳样式，可以用于分组表单，帮助用户阅读更清晰。

### group-flat

同 simple-flat，但是会在外层添加一个外壳样式，可以用于分组表单，帮助用户阅读更清晰。
