# 表单标签页

表单支持使用Tab组件分页、分组，Tab分页适用于表单数据较多且有相似项目可以分组时。支持分组多个页面，方便用户操作。

## 基础使用

tab组件的对象属性嵌套类似于 [simple-flat](./form-nest.md#simple-flat)，每个标签页访问同级对象。

* 使用 `custom-tab` 声明一个标签组件。
* 使用 `custom-tab-page` 声明一个标签页，标签页必须处于标签组件的子级。

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
import { BaseCheckProps, BaseSelectProps, DynamicForm, IDynamicFormOptions, defaultDynamicFormInternalWidgets } from '@imengyu/vue-dynamic-form';
import { computed, ref } from 'vue'

const formModel = ref({
  text1: '',
  text2: '',
  text3: '',
  text4: '',
  check1: false,
  check2: false,
  check3: false,
});
const formOptions : IDynamicFormOptions = {
  internalWidgets: defaultDynamicFormInternalWidgets,
  formLabelCol: { span: 8 },
  formWrapperCol: { span: 16 },
  formItems: [
    {
      name: 'rootTab', label: '', type: 'custom-tab',
      additionalProps: {
        defaultActiveKey: 'page1',
        tabProps: {
          type: 'rounded',
          size: 'mini',
          headerPadding: false,
          class: 'editor-small',
        } as TabsInstance['$props'],
      } as IDynamicFormTabProps,
      children: [
        {
          name: 'page1', label: '提交信息1', type: 'custom-tab-page',
          children: [
            { type: 'text', label: '提交信息1', name: 'text1', additionalProps: { placeholder: '请输入文本' } },
            { type: 'text', label: '提交信息2', name: 'text2', additionalProps: { placeholder: '请输入文本' } },
            { type: 'text', label: '提交信息3', name: 'text3', additionalProps: { placeholder: '请输入文本' } },
            { type: 'text', label: '提交信息4', name: 'text4', additionalProps: { placeholder: '请输入文本' } },
          ],
        },
        {
          name: 'page2', label: '提交信息2', type: 'custom-tab-page',
          children: [
            { type: 'check-box', label: '提交信息5', name: 'check1' },
            { type: 'check-box', label: '提交信息6', name: 'check2' },
            { type: 'check-box', label: '提交信息7', name: 'check3' },
          ],
        },
        {
          name: 'page3', label: '提交信息3', type: 'custom-tab-page',
          children: [
            {
              type: 'select', label: '提交信息9', name: 'select1',
              additionalProps: {
                options: [
                  { label: '全部', value: 0 },
                  { label: '苹果', value: 1 },
                  { label: '香蕉', value: 2 },
                  { label: '葡萄', value: 3 },
                ]
              }
            },
            {
              type: 'select', label: '提交信息10', name: 'select2',
              additionalProps: {
                options: [
                  { label: '全部', value: 0 },
                  { label: '苹果', value: 1 },
                  { label: '香蕉', value: 2 },
                  { label: '葡萄', value: 3 },
                ]
              }
            },
          ],
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

## 自定义Tab组件

:::tip
还可以使用第三方的组件Tab组件和TabPage组件，以 ArcoDesign 为例，注册其Tab组件。
:::

```ts
import { Tabs, TabPane } from "@arco-design/web-vue";

configDefaultDynamicFormOptions({
  internalWidgets: {
    //...省略
    Tab: {
      component: markRaw(Tabs),
      propsMap: {
        activeKey: 'activeKey',
        defaultActiveKey: 'defaultActiveKey',
      },
    },
    TabPage: {
      component: markRaw(TabPane),
      propsMap: {
        title: 'title',
        disabled: 'disabled',
      },
    },
  },
  formLabelCol: { span: 8 },
  formWrapperCol: { span: 16 },
  //...省略
  formItems: [],
} as IDynamicFormOptions);
```

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
import { BaseCheckProps, BaseSelectProps, DynamicForm, IDynamicFormOptions } from '@imengyu/vue-dynamic-form';
import { computed, ref } from 'vue'

const formModel = ref({
  text1: '',
  text2: '',
  text3: '',
  text4: '',
  check1: false,
  check2: false,
  check3: false,
});
const formOptions : IDynamicFormOptions = {
  formLabelCol: { span: 8 },
  formWrapperCol: { span: 16 },
  formItems: [
    {
      name: 'rootTab', label: '', type: 'custom-tab',
      additionalProps: {
        defaultActiveKey: 'page1',
        tabProps: {
          type: 'rounded',
          size: 'mini',
          headerPadding: false,
          class: 'editor-small',
        } as TabsInstance['$props'],
      } as IDynamicFormTabProps,
      children: [
        {
          name: 'page1', label: '提交信息1', type: 'custom-tab-page',
          children: [
            { type: 'text', label: '提交信息1', name: 'text1', additionalProps: { placeholder: '请输入文本' } },
            { type: 'text', label: '提交信息2', name: 'text2', additionalProps: { placeholder: '请输入文本' } },
            { type: 'text', label: '提交信息3', name: 'text3', additionalProps: { placeholder: '请输入文本' } },
            { type: 'text', label: '提交信息4', name: 'text4', additionalProps: { placeholder: '请输入文本' } },
          ],
        },
        {
          name: 'page2', label: '提交信息2', type: 'custom-tab-page',
          children: [
            { type: 'check-box', label: '提交信息5', name: 'check1' },
            { type: 'check-box', label: '提交信息6', name: 'check2' },
            { type: 'check-box', label: '提交信息7', name: 'check3' },
          ],
        },
        {
          name: 'page3', label: '提交信息3', type: 'custom-tab-page',
          children: [
            {
              type: 'select', label: '提交信息9', name: 'select1',
              additionalProps: {
                options: [
                  { label: '全部', value: 0 },
                  { label: '苹果', value: 1 },
                  { label: '香蕉', value: 2 },
                  { label: '葡萄', value: 3 },
                ]
              }
            },
            {
              type: 'select', label: '提交信息10', name: 'select2',
              additionalProps: {
                options: [
                  { label: '全部', value: 0 },
                  { label: '苹果', value: 1 },
                  { label: '香蕉', value: 2 },
                  { label: '葡萄', value: 3 },
                ]
              }
            },
          ],
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