---
title: 内置 Form 参考
---

# 内置 Form 参考

下面参考仅用于默认表单，如果你更换了其他 UI库 的表单，则请以其文档为准。

## Form

表单组件。

### FormProps

| 属性 | 描述 | 类型 | 默认值 |
| :----: | :----: | :----: | :----: |
| model | 表单数据对象 | `object` | - |
| rules | 表单验证规则 | `Record<string, Rule>` | - |
| colon | 配置 Form.Item 的 colon 的默认值 | `boolean` | - |
| hideRequiredMark | 隐藏所有表单项的必选标记 | `boolean` | - |
| labelAlign | 统一设置左侧文本对齐 | `'left'` or `'center'` or `'right'` | - |
| labelCol | 统一设置左侧文本的flex占比 | `number` | 2 |
| wrapperCol | 统一设置输入框的flex占比 | `number` | - |
| validateTrigger | 统一设置字段校验规则 onBlur 文本框失去焦点时校验/onValueChange 数值更改时校验/onSubmit 提交时校验(默认) | `ValidTrigger` | false |
| showLabel | 是否显左边标题 | `boolean` | true |
| name | 表单的名称 | `string` | - |

### Events

| 事件名 | 描述 | 参数 |
| :----: | :----: | :----: |
| finish | 提交表单且数据验证成功后回调事件 | - |
| finishFailed | 提交表单且数据验证失败后回调事件 | - |
| submit | 数据验证成功后回调事件 | - |

### Form

实例方法。

#### clearValidate

清空指定属性的校验结果。

| 参数 | 描述 | 类型 | 必填 |
| :----: | :----: | :----: | :----: |
| name | 指定属性名称，不填为整个表单 | `string|string[]` | 否 |

#### resetFields

重置属性的值。

| 参数 | 描述 | 类型 | 必填 |
| :----: | :----: | :----: | :----: |
| name | 指定属性名称，不填为整个表单 | `string|string[]` | 否 |

#### validate

对指定属性进行校验。

| 参数 | 描述 | 类型 | 必填 |
| :----: | :----: | :----: | :----: |
| name | 指定属性名称，不填为整个表单 | `string|string[]` | 否 |

#### scrollToField

滚动表单页面至指定属性。

| 参数 | 描述 | 类型 | 必填 |
| :----: | :----: | :----: | :----: |
| name | 属性名称 | `string` | 是 |

#### submit

手动提交表单。

| 参数 | 描述 | 类型 | 必填 |
| :----: | :----: | :----: | :----: |
| valid | 是否需要校验表单，默认 true | `valid` | 否 |

## FormItem

表单条目组件。

### FormItemProps

| 属性 | 描述 | 类型 | 默认值 |
| :----: | :----: | :----: | :----: |
| label | 输入框左侧文本 | `string` | - |
| name | 名称，作为提交表单时的标识符 | `object` | - |
| disabled | 是否禁用输入框 | `boolean` | false |
| center | 是否内容垂直居中 | `boolean` | true |
| colon | 是否在 label 后面添加冒号 | `boolean` | true |
| required | 是否必填 | `boolean` | false |
| showRequiredBadge | 是否显示表单必填星号 | `boolean` | false |
| labelAlign | 左侧文本对齐 | `'left'` or `'center'` or `'right'` | - |
| labelCol | 左侧文本的flex占比 | `{ span?: number, offset?: number }` | - |
| wrapperCol | 输入框的flex占比 | `{ span?: number, offset?: number }` | - |
| labelStyle | 左侧文本的样式 | `object` | - |
| labelColor | 左侧文本的颜色 | `string` | - |
| labelDisableColor | 左侧文本的禁用颜色 | `string` | - |
| validateTrigger | 设置字段校验的时机  onBlur 文本框失去焦点时校验/onValueChange 数值更改时校验/onSubmit 提交时校验(默认) | `ValidTrigger` | - |
| showLabel | 是否显左边标题 | `boolean` | true |
| noBottomMargin | 是否去掉底部编辑 | `boolean` | false |

## FormContext

用于表单校验。仅用于默认表单，如果你更换了其他 UI库 的表单，则请以其文档的自定义表单为准。

### useInjectFormItemContext()

用于表单项的注册，用法：

```vue
<template>
  <input
    :type="password?'password':'text'" 
    :value="value"
    @blur="onBlur"
    @update:modelValue="(e: string) => onValueUpdate(e)"
    @change="(e: Event) => onValueUpdate((e.target as HTMLInputElement).value)"
  />
</template>

<script lang="ts" setup>
import { useInjectFormItemContext } from "../DynamicFormBasicControls";

defineProps({
  value: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([ 'update:value' ]);

//注册这个表单的组件
const formContext = useInjectFormItemContext();

function onBlur() {
  //反馈失去焦点事件，用于表单验证
  formContext.onFieldBlur();
}
function onValueUpdate(v: string) {
  emit('update:value', v);
  
  //反馈数据到表单在
  formContext.onFieldChange(v);
}
</script>
```
