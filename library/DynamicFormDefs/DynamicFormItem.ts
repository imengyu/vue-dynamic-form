import type { ColProps } from "../DynamicFormBasicControls/Layout/Col.vue";
import type { Rule } from 'async-validator';
import type { RowProps } from "../DynamicFormBasicControls";
import type { Slot } from "vue";
import type { IDynamicFormPropsMap, IDynamicFormWidgetPropsMap } from "./DynamicFormWidgets";
import type { DynamicFormFormAdditionalPropsCommon, IDynamicFormRef } from "./DynamicFormOptions";
import type { IDynamicFormObject } from "../DynamicForm";

/**
 * 表单动态属性定义
 */
export type IDynamicFormItemCallback<T> = {
  /**
   * @param model 当前表单条目的值
   * @param rawModel 整个 form 的值 （最常用，当两个关联组件距离较远时，可以从顶层的 rawModel 里获取）
   * @param parentModel 父表单元素的值 （上一级的值，只在列表场景的使用，例如列表某个元素的父级就是整个 item）
   * @param params 当前表单条目信息
   */
  callback: (model: unknown, rawModel: unknown, parentModel: unknown, params: {
    /**
     * 当前表单条目
     */
    item: IDynamicFormItem, 
    /**
     * 当前表单条目的父级，为空时表示当前条目为根级别。
     */
    parent?: IDynamicFormItem,
    /**
     * 当前表单组件实例
     */
    form: IDynamicFormRef,
    /**
     * 全局参数。由表单组件顶层添加额外的参数。
     */
    formGlobalParams: IDynamicFormObject, 
    /**
     * 当前条目校验数据
     */
    formRules?: Record<string, Rule>,
    /**
     * 是否是所在层级的第一个表单项
     */
    isFirst: boolean,
    /**
     * 是否是所在层级的最后一个表单项
     */
    isLast: boolean,
  }, ) => T;
}

/**
 * 表单项定义
 * 
 * @param T 当前表单类型
 * @param P 附加组件属性类型
 * @param E 附加组件事件类型
 */
export interface IDynamicFormItem<
  T = string, 
  P = unknown, 
  M extends IDynamicFormPropsMap = IDynamicFormPropsMap,
> {
  /**
   * 当前表单类型
   */
  type: T;
  /**
   * 是否隐藏当前表单项。当返回true隐藏当前条目。为undefined或者返回其他值时，默认显示。
   * * 注意：hidden 与 show 不能同时设置。
   */
  hidden?: boolean|IDynamicFormItemCallback<boolean>;
  /**
   * 是否显示当前表单项。当返回false隐藏当前条目。为undefined或者返回其他值时，默认显示。
   * * 注意：hidden 与 show 不能同时设置。
   */
  show?: boolean|IDynamicFormItemCallback<boolean>;
  /**
   * 是否禁用当前表单项
   * @default false
   */
  disabled?: boolean|IDynamicFormItemCallback<boolean>;
  /**
   * 附加组件属性。支持动态回调(只支持第一级传入回调)。
   */
  additionalProps?: (P & DynamicFormFormAdditionalPropsCommon)|IDynamicFormItemCallback<P & DynamicFormFormAdditionalPropsCommon>;
  /**
   * 附加组件插槽。
   * 
   * 组件还内置了两个插槽：
   * * dynamicFormPrefix 表单项内容前缀
   * * dynamicFormSuffix 表单项内容后缀
   */
  additionalSlot?: Record<string, Slot>;
  /**
   * 附加组件事件绑定。事件名称不需要加 on 前缀。
   */
  additionalEvents?: M['FormEvents'];
  /**
   * 附加组件属性。此属性直接应用到目标渲染组件上，没有联动回调。
   */
  additionalDirectProps?: unknown;
  /**
   * 默认值。如果表单条目接收到 undefined 或 null ，则使用默认值。
   * 可以使用一个工厂函数返回对象。
   * 需要在顶层调用 `formRef.value.initDefaultValuesToModel` 方法初始化默认值至模型中才可生效。
   */
  defaultValue?: any;
  /**
   * 是否屏蔽空错误。默认否
   * @default false
   */
  suppressEmptyError?: boolean,
  /**
   * 当前条目的校验规则，赋值至 FormItem 上。
   */
  rules?: M['ItemRules'];

  /**
   * 加载时的钩子函数
   * @param nowValue 当前组件的实例
   * @param getComponentRef 当前组件的实例
   * @returns 
   */
  mounted?: (nowValue: unknown, rawModel: unknown, getComponentRef: () => unknown) => void;
  /**
   * 当前表单组件卸载之前的钩子函数
   * @param componentRef 当前组件的实例
   * @returns 
   */
  beforeUnmount?: (nowValue: unknown, rawModel: unknown, componentRef: () => unknown) => void;
  /**
   * 监听当前表单项数据更改
   * @param oldValue 旧数据
   * @param newValue 新数据
   * @param getComponentRef 当前组件的实例
   * @returns 
   */
  watch?: (oldValue: unknown, newValue: unknown, rawModel: unknown, getComponentRef: () => unknown) => void,
  /**
   * 监听从外部或者其他表单发送过来的消息事件
   * @param messageName 消息名称
   * @param data 消息数据
   * @param getComponentRef 当前组件的实例
   * @returns 
   */
  message?: (messageName: string, data: unknown, getComponentRef: () => unknown) => void,
  /**
   * 附加 FormItem 组件属性
   */
  formProps?: M['FormItem'] & DynamicFormFormAdditionalPropsCommon;
  /**
   * 表单label栅格宽度。如果使用自定义Form，请同时设置属性名映射。
   */
  formLabelCol?: { span: number, offset?: number }|string|number,
  /**
   * 表单组件栅格宽度。如果使用自定义Form，请同时设置属性名映射。
   */
  formWrapperCol?: { span: number, offset?: number }|string|number,
  /**
   * 当前表单项名称。
   */
  name: string;
  /**
   * 当前表单说明文字。支持动态回调。
   */
  label?: string|IDynamicFormItemCallback<string>;
  /**
   * 子条目。仅在 object 或者其他容器条目中有效。
   */
  children?: IDynamicFormItemUnion<M>[];
  /**
   * 当子对象为数组时，可设置这个自定义回调。用于添加按钮新建一个对象，如果这个函数为空，则没有添加按钮。
   */
  newChildrenObject?: (arrayNow: unknown[]) => unknown;
  /**
   * 当子对象为数组时，可设置这个自定义回调。删除按钮回调，可选，不提供时默认操作为将 item 从 array 中移除。
   */
  deleteChildrenCallback?: (arrayNow: unknown[], deleteObject: unknown) => unknown;
  /**
   * 子条目的 Col 配置属性(应用到当前条目的所有子条目上)。仅在 object 或者其他容器条目中有效。
   */
  childrenColProps?: ColProps,
  /**
   * 应用到当前子级表单label栅格宽度。优先级低于条目自己的 formLabelCol。
   */
  childrenFormLabelCol?: { span: number, offset?: number }|string|number,
  /**
   * 应用到当前子级表单组件栅格宽度。优先级低于条目自己的 formWrapperCol。
   */
  childrenFormWrapperCol?: { span: number, offset?: number }|string|number,
  /**
   * 应用到当前子级项目的 FormItem 组件属性。仅在 object 或者其他容器条目中有效。
   */
  childrenFormProps?: M['FormItem'],
  /**
   * 当前条目的 Col 配置属性(应用到当前条目上)。仅在 object 或者其他容器条目中有效。
   */
  colProps?: ColProps,
  /**
   * 当前条目的 Row 配置属性(应用到当前条目上)。仅在 object 或者其他容器条目中有效。
   */
  rowProps?: RowProps,
  /**
   * 当显示嵌套的表单对象条目时是否在前部显示缩进。默认是
   */
  nestObjectMargin?: boolean,
}

type DynamicFormWidgetType = keyof IDynamicFormWidgetPropsMap;
type DynamicFormItemByType<K extends DynamicFormWidgetType, M extends IDynamicFormPropsMap = IDynamicFormPropsMap> =
  Omit<IDynamicFormItem<K, IDynamicFormWidgetPropsMap[K], M>, 'additionalProps'> & {
    type: K;
    additionalProps?: (IDynamicFormWidgetPropsMap[K] & DynamicFormFormAdditionalPropsCommon)
      |IDynamicFormItemCallback<IDynamicFormWidgetPropsMap[K] & DynamicFormFormAdditionalPropsCommon>;
  };
export type IDynamicFormItemUnion<M extends IDynamicFormPropsMap = IDynamicFormPropsMap> = {
  [K in keyof IDynamicFormWidgetPropsMap]: DynamicFormItemByType<K, M>
}[keyof IDynamicFormWidgetPropsMap];

/**
 * 定义表单项的工具函数。
 * @param options 表单项选项
 * @returns 
 */
export function defineDynamicFormItem<T extends keyof IDynamicFormWidgetPropsMap>(
  options: { 
    type: T,
    additionalProps?: IDynamicFormWidgetPropsMap[T]|IDynamicFormItemCallback<IDynamicFormWidgetPropsMap[T]>,
  } & Omit<IDynamicFormItem<T, IDynamicFormWidgetPropsMap[T]>, 'additionalProps' | 'type'>
) {
  return options;
}
/**
 * 定义表单选项的工具函数。
 * @param options 表单选项
 * @returns 
 */
export function defineDynamicFormItemChildren<
  T extends IDynamicFormItemUnion[]
>(children: T) {
  return children;
}