---
title: API 参考 - DynamicForm
---

# API 参考 - DynamicForm

动态表单组件。

## Props

| 属性 | 描述 | 类型 | 默认值 |
| :----: | :----: | :----: | :----: |
| model | 表单数据模型 | `Object` | — |
| options | 表单相关定义 | [IDynamicFormOptions](./DynamicFormOptions.md) | — |

## Events

| 事件名 | 描述 | 参数 |
| :----: | :----: | :----: |
| finish | 提交表单且数据验证成功后回调事件 | - |
| finishFailed | 提交表单且数据验证失败后回调事件 | - |
| submit | 数据验证成功后回调事件 | - |
| ready | 表单初始化完成，实例引用已经就绪时发出事件 | - |

## Slots

| 插槽名 | 描述 | 参数 |
| :----: | :----: | :----: |
| formCeil | 表单条目自定义渲染插槽 | 参数见下方 |
| formArrayButtonAdd | 数组条目的添加按钮渲染插槽 | `{ onClick: () => void }` |
| formArrayButtons | 数组条目的删除/上移/下移按钮自定义渲染插槽 | `{ onDeleteClick: () => void, onUpClick: () => void, onDownClick: () => void }` |
| empty | 当前表单没有条目时显示的空插槽 | - |
| endButton | 当前表单末尾渲染插槽，通常用于横向布局的表单末尾按钮 | - |

### formCeil 插槽参数

| 属性 | 描述 | 类型 | 默认值 |
| :----: | :----: | :----: | :----: |
| name | 表单项的完整路径 | `string` | — |
| item | 表单项定义 | `IDynamicFormItem` | — |
| model | 表单项当前的值 | `Object` | — |
| onModelUpdate | 用于双向绑定数据回调 | `(v: unknown) => void` | — |
| rawModel | 整个 form 的值 （最常用，当两个关联组件距离较远时，可以从顶层的 rawModel 里获取） | `Object` | — |
| parentModel | 父表单元素的值 （上一级的值，只在列表场景的使用，例如列表某个元素的父级就是整个 item） | `Object` | — |
| disabled | 是否禁用当前表单项 | `boolean` | `false` |
| rule | 当前条目校验数据 | `Object` | — |

## IDynamicFormRef

表单实例方法。

| 函数名 | 描述 |
| :----: | :----: |
| `getFormRef: <T>() => T` | 获取表单组件的 Ref |
| `getFormItemControlRef: <T>(key: string) => T` | 获取指定表单项组件的 Ref |
| `submit: () => void` | 触发提交。同 getFormRef().submit() |
| `validate: () => Promise<void>` | 触发校验。同 getFormRef().validate() |
| `setValueByPath: (path: string, value: unknown) => void` | 外部修改指定单个 field 的数据 |
| `getValueByPath: (path: string) => unknow` | 外部获取指定单个 field 的数据 |
| `getVisibleFormNames: () => string[]` | 获取当前表单中可见的所有字段名 |
| `initDefaultValuesToModel: () => void`| 初始化表单默认值到模型中，对于已有数据非空的字段，不会覆盖已有的值。 |
