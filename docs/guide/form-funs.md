---
title: 表单方法
---

# 表单方法

动态表单实例上提供了如下方法，方便你的使用。

## 获取表单组件实例引用

可以通过 `getFormRef` 实例函数获取到内置 Form 组件的实例引用。

注意，这个 Form 取决于你使用的 Form 组件, 例如，你使用了Arco Desgin的 Form 组件，那么获取的类型就是 Arco 的 FormInstance。

默认的内置 Form 组件类型是 `import { Form } from '@imengyu/vue-dynamic-form';`。

```vue
<template>
  <DynamicForm
    ref="formRef"
    :options="formOptions"
    :model="formModel"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FormInstance } from '@arco-design/web-vue';

//这个是外层动态表单的引用
const formRef = ref<IDynamicFormRef>();

onMounted(() => {
  //可以通过
  const form = formRef.value?.getFormRef<FormInstance>();
  //手动调用form上的validate校验表单方法
  form.validate().then((res) => {
    console.log(res); 
  }).catch((e) => {
    console.log(e);
  })
});

</script>
```

## 获取表单项组件实例引用

某些情况下，你可能需要直接操作自己的表单自定义组件。例如，你写了一个动态加载数据的下拉框，表单外部有一些条件，
要求是表单某几项参数变化时，需要重新加载下拉框的数据。

你可以通过 `getFormItemControlRef` 实例函数获取到指定表单项组件的实例引用，获取引用后，你就可以自由进行调用了。

下方是一个例子。他的效果是当 type 更改时，调用 my-select 去加载数据

```vue
<template>
  <DynamicForm
    ref="formRef"
    :options="formOptions"
    :model="formModel"
    @ready="onReady"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FormInstance } from '@arco-design/web-vue';
import { BaseCheckProps, BaseRadioProps, BaseSelectProps, BaseTextAreaProps, DynamicForm, IDynamicFormOptions } from '@imengyu/vue-dynamic-form';

//这个是外层动态表单的引用
const formRef = ref<IDynamicFormRef>();

const formModel = ref({
  type: 0,
  item_id: 0,
});
const formOptions : IDynamicFormOptions = {
  formRules: {},
  formLabelCol: { span: 6 },
  formWrapperCol: { span: 18 },
  formItems: [
    { 
      type: 'base-radio', label: '会员类型', name: 'type', 
      additionalProps: {
        items: [
          { label: '短期', value: 1 },
          { label: '长期', value: 2 },
          { label: '试用', value: 3 },
        ]
      } as BaseRadioProps,
    },
    {
      //my-select 是一个自定义的组件
      type: 'my-select', label: '选择套餐', name: 'item_id', 
      additionalProps: { placeholder: '请选择套餐' },
    },
  ],
};

function loadPackageSelect(newType: number) {
  //这里是写死手动判断了，实际在这里你可以去请求后端数据
  let newData = [] as SelectValueOption[];
  switch (newType) {
    case 1:
      newData = [
        { text: '短期合作套餐', value: 0 },
        { text: '短期高级套餐', value: 1 },
      ];
      break;
    case 2:
      newData = [
        { text: '基础套餐', value: 0 },
        { text: '商业套餐', value: 1 },
        { text: '贵宾套餐', value: 2 },
      ];
      break;
    case 3:
      newData = [
        { text: '试用套餐', value: 0 },
      ];
      break;
  }
  //更改后调用实例方法，重新加载数据
  formRef.value?.getFormItemControlRef<SimpleSelectValueFormItemRef>('item_id')?.setData(newData);

  formModel.value.item_id = null;
}

//监听 type 属性的更改
watch(() => formModel.value.type, (newType) => {
  //更改后重新加载数据
  loadPackageSelect(newType);
});
function onReady() {
  //初始化的时候也加载一下数据
  loadPackageSelect(1);
}

</script>
```