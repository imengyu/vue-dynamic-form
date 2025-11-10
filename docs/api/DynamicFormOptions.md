---
title: API 参考 - IDynamicFormOptions
---

# API 参考 - IDynamicFormOptions

动态表单配置项参考。

| 属性 | 描述 | 类型 | 必填 |
| :----: | :----: | :----: | :----: |
| formItems | 表单条目数据 | [`IDynamicFormItem[]`](#idynamicformitem) | 是 |
| formRules | 表单的校验规则 | `Record<string, Rule>` | — |
| formLabelCol | 表单label栅格宽度 | `{ span: number, offset?: number }` | — |
| formLabelWidth | 表单label宽度 | `number\|string` | — |
| formWrapperCol | 表单组件栅格宽度 | `{ span: number, offset?: number }` | — |
| formAdditionaProps | 表单组件附加属性 | `Record<string, unknown>` | — |
| formAdditionalEvents | 表单组件附加事件绑定 | `Record<string, Function>` | — |
| formNestNameGenerateType | 表单嵌套名称生成类型。该选项用于生成嵌套表单对象的名称，例如 `a.b.c` 或者 `['a','b','c']` ，用于适配不同的UI库组件的name定义（例如 ant-design-vue 的 FormItem 组件，表单验证时需要使用数组格式‘array’）。 | `'dot' \| 'bracket'` | — |
| widgets | 自定义重写表单控件。你可以重写内置控件，在这个表单中会以此重写列表为先查找表单组件。 | [`Record<string, DynamicFormItemRegistryItem>`](./global.md#dynamicformitemregistryitem) | — |
| internalWidgets | 自定义重写内置表单控件 Form FormItem。你可以使用其他组件库的组件例如 elemnent-ui 或者 ant-desgin-vue | [`IDynamicFormInternalWidgets`](#idynamicforminternalwidgets) | — |
| disabled | 表单是否禁用 | `boolean` | — |
| emptyText | 当表单中无可用编辑条目时，显示的提示，为空则不显示提示。默认为空 | `string` | — |
| suppressRootError | 是否屏蔽顶层对象错误。默认否 | `boolean` | — |
| suppressEmptyError | 是否屏蔽所有子条目空错误。默认否 | `boolean` | — |
| nestObjectMargin | 当显示嵌套的表单对象条目时是否在前部显示缩进，缩进大小可使用 CSS 变量 `--dynamic-form-item-nest-margin` 自定义。默认是 20px | `boolean` | — |

## IDynamicFormItem

表单条目

| 属性 | 描述 | 类型 | 必填 |
| :----: | :----: | :----: | :----: |
| type | 当前表单类型 | `string` | 是 |
| hidden | [联动回调] 显是否隐藏当前表单项 | `boolean` or `IDynamicFormItemCallback<boolean>` | — |
| disabled | [联动回调] 是否禁用当前表单项 | `boolean` or `IDynamicFormItemCallback<boolean>` | — |
| additionalProps | [联动回调] 附加组件属性。支持动态回调(只支持第一级传入回调)。当传入值是函数时，请使用 additionalDirectProps。 | `string` | — |
| additionalEvents | 附加组件事件绑定。事件名称不需要加 on 前缀。 | `Record<string, Function>` | — |
| additionalDirectProps | 当前表单类型 | `string` | — |
| type | 附加组件属性。此属性直接应用到目标渲染组件上，没有联动回调。 | `Record<string, unknown>` | — |
| rules | 当前条目的校验规则。 | `any[]` | — |
| formProps | 附加 FormItem 组件属性 | `unknown` | — |
| watch | 监听当前表单数据更改 | `(oldValue: unknown, newValue: unknown) => void` | — |
| name | 当前表单项名称。 | `string` | 是 |
| label | [联动回调] 当前表单说明文字。支持动态回调。 | `string` or `IDynamicFormItemCallback<string>` | — |
| defaultValue | 默认值。如果表单条目接收到 undefined 或 null ，则使用默认值。可以使用一个工厂函数返回对象。需要在顶层调用 `formRef.value.initDefaultValuesToModel` 方法初始化默认值至模型中才可生效。| `unknown` | — |
| suppressEmptyError | 是否屏蔽当前子条目的空错误，为空时使用 defaultValue 作为值，注意：仅作为兜底使用。默认否 | `boolean` | - |
| children | 子条目。仅在 'object','array-single','array-object','group-object' 或者其他容器条目中有效。 | `IDynamicFormItem[]` | — |
| newChildrenObject | 当子对象为数组时，可设置这个自定义回调。用于添加按钮新建一个对象，如果这个函数为空，则没有添加按钮。 | `(arrayNow: unknown[]) => unknown` | — |
| deleteChildrenCallback | 当子对象为数组时，可设置这个自定义回调。删除按钮回调，可选，不提供时默认操作为将 item 从 array 中移除。 | `(arrayNow: unknown[], deleteObject: unknown) => unknown` | — |
| childrenColProps | 子条目的 Col 配置属性(应用到当前条目的所有子条目上)。仅在 object 或者其他容器条目中有效。 | `ColProps` | — |
| colProps | 条目的 Col 配置属性(应用到当前条目上)。仅在 object 或者其他容器条目中有效。 | `ColProps` | — |
| rowProps | 条目的 Row 配置属性(应用到当前条目上)。仅在 object 或者其他容器条目中有效。 | `RowProps` | — |

## IDynamicFormInternalWidgets

自定义重写内置表单控件 Form FormItem 定义。

```ts
{
  Form: {
    /**
     * 组件实例
     */
    component: unknown,
    /**
     * 属性的名称修改
     * 每个UI框架的属性名称有点不一样，你需要根据对应的文档重新写对应的属性名称
     * 右边是对应的属性名称
     */
    propsMap: {
      rules?: string,
      model?: string,
      labelCol?: string,
      labelWidth?: string,
      wrapperCol?: string,
      //提交成功事件
      onFinish?: string,
      //提交失败事件
      onFinishFailed?: string,
      //submit事件
      onSubmit?: string,
    },
  },
  FormItem: {
    /**
     * 组件实例
     */
    component: unknown,
    /**
     * 属性的名称修改
     */
    propsMap: {
      name?: string,
      label?: string,
    },
  },
  Tab?: {
    /**
     * 组件实例
     */
    component: unknown,
    /**
     * 属性的名称修改
     */
    propsMap: {
      activeKey?: string,
      defaultActiveKey?: string,
    },
  },
  TabPage?: {
    /**
     * 组件实例
     */
    component: unknown,
    /**
     * 属性的名称修改
     */
    propsMap: {
      key?: string,
      title?: string,
      disabled?: string,
    },
  },
}
```

## 表单联动属性回调定义 (IDynamicFormItemCallback)

| 属性 | 描述 | 类型 | 必填 |
| :----: | :----: | :----: | :----: |
| model | 当前表单条目的值 | `unknown` | 是 |
| rawModel | 整个 form 的值 （最常用，当两个关联组件距离较远时，可以从顶层的 rawModel 里获取） | `unknown` | 是 |
| parentModel | 父表单元素的值 （上一级的值，只在列表场景的使用，例如列表某个元素的父级就是整个 item） | `unknown` | 是 |
| params | 当前表单条目信息 | `IDynamicFormItemCallbackParams` | 是 |

### IDynamicFormItemCallbackParams

| 属性 | 描述 | 类型 | 必填 |
| :----: | :----: | :----: | :----: |
| item | 当前表单条目信息 | `IDynamicFormItem` | 是 |
| formRules | 当前条目校验数据 | `Record<string, Rule>` | 否 |
| form | 当前表单实例 | `IDynamicFormRef` | 是 |
| formGlobalParams | 当前表单实例 | `IDynamicFormRef` | 是 |
