---
title: 自定义组件
---

# 自定义组件

自定义组件功能使表单拥有很好扩展性，可能的应用场景如下：

* 我需要写一个异步加载的搜索输入框（普适性不高/难以用 schema 描述的组件）
* 我需要在表单内部写一个 excel 上传按钮（完全定制化的需求）

自定义组件可以选择局部注册，也可选择全局注册：

* 局部注册：仅在某个表单中使用。
* 全局注册：可以在全部的表单中使用，通常是重复使用的组件。

## 编写组件

组件与普通表单组件基本一致，但是有以下这些表单属性会被传入：

|属性|类型|说明|
|--|--|--|
|item|IDynamicFormItem|当前表单项的数据定义|
|disabled|boolean|当前表单项是否禁用|
|rawModel|IDynamicFormObject|整个表单的值|
|parentModel|IDynamicFormObject|父表单元素的值 （上一级的值，只在列表场景的使用，例如列表某个元素的父级就是整个 item）|
|`[主属性名称]`|unknown|当前表单的值，“主属性名称” 是 `registerDynamicFormItemControl` 注册时指定的 |
|name|string|当前表单项的数据键值名称|

另外，用户可以指定 additionalProps、additionalEvents 和 additionalDirectProps, 这些属性与事件都会被绑定到你的组件上。

事件:

为了实现数据双向绑定，发出 `'update:[主属性名称]'` 事件用于数据更改事件。（“主属性名称” 是 `registerDynamicFormItemControl` 注册时指定的）。

如下，这是一个自定义 check-box 的示例：

```vue
BaseCheck.vue
<template>
  <div>
    <input
      class="dynamic-form-base-control base-checkbox"
      type="checkbox"
      :modelValue="value"
      :id="name"
      @update:modelValue="onValueUpdate"
      @change="(e: Event) => onValueUpdate((e.target as HTMLInputElement).checked)"
      @blur="onBlur"
    />
    <label :for="name">{{text}}</label>
  </div>
</template>

<script lang="ts" setup>
import { useInjectFormItemContext } from "../DynamicFormBasicControls";

defineProps({
  //这是传入的数据
  value: {},
  //你可以定义其他自定义属性，可以通过 additionalProps 传入。
  name: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
});

const emit = defineEmits([ 'update:value' ]);

//注： useInjectFormItemContext 是UI组件库的表单项上下文，是为了
//表单校验所设置的，每个UI组件库都不同，具体请参考对应的文档
const formContext = useInjectFormItemContext();

function onBlur() {
  formContext.onFieldBlur();
}
function onValueUpdate(v: boolean) {
  emit('update:value', v);//这里是为了数据可以双向绑定
  formContext.onFieldChange(v);
}
</script>
```

## 全局注册

注：全局注册在运行中只需要注册一次即可。

```js
import BaseCheck from 'BaseCheck.vue';

DynamicFormItemRegistry.registerDynamicFormItemControl('base-check', markRaw(BaseCheck), {}, 'value');//指定传入主属性是 “value”
```

## 局部注册

在表单属性的 widgets 中注册，这个组件可以在整个表单中使用，参数与 registerDynamicFormItemControl 一致：

```js
const formOptions = ref<IDynamicFormOptions>({
  widgets: {
    'base-check': {
      componentInstance: markRaw(BaseCheck),
      valueName: 'value',
      additionalProps: {},
    }
  },
  formItems: [
    ...
  ]
});
```

## 一些情况下不需要自己手写自定义组件哦

自定义组件就是普通的 Vue 组件，唯一的要求是要有一个双向绑定值。所以如果现成的组件已经有了双向绑定的主属性，就可以直接拿来用，只需要在注册时指定主属性的名称。

举例来说：现在我们需要使用“级联选择”组件，这时打开 arco desgin 文档，我们看到 cascader 默认使用了 model-value (v-model)，那就直接拿来用吧：

```ts
import { Cascader } from "@arco-design/web-vue";
  
DynamicFormItemRegistry.registerDynamicFormItemControl('cascader', markRaw(Cascader), {}, 'modelValue'); //指定传入主属性是 “modelValue”
```

注册后即可使用：

传入的 additionalProps 就是这个组件的属性，具体 arco 为我们写好了定义，也可以直接导入，这样就有有类型定义了。

```ts
import { CascaderInstance } from "@arco-design/web-vue";

const formOptions = ref<IDynamicFormOptions>({
  formItems: [
    { 
      type: 'cascader', label: '级联组件', name: 'test',
      additionalProps: {
        placeholder: '请选择发货地区' 
      } as CascaderInstance['$props'] //这里导入了 CascaderInstance 为了有类型定义
    },
  ]
});
```
