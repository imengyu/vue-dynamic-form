import type { ColProps } from "./DynamicFormBasicControls/Layout/Col.vue";
import type { DynamicFormItemRegistryItem } from "./DynamicFormItemRenderer/DynamicFormItemRegistry";
import type { Rule } from 'async-validator';
import { Form, FormItem, type RowProps } from "./DynamicFormBasicControls";
import { type Ref, type Slot, type VNode, h, markRaw } from "vue";

export type IDynamicFormObject = Record<string, unknown>;
/**
 * 表单动态属性定义
 */
export type IDynamicFormItemCallback<T> = {
  /**
   * 预留，暂未使用
   */
  type?: string,
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

export type DynamicFormNestNameGenerateType = 'dot'|'array'
export type IDynamicFormItemCallbackAdditionalProps<T> = { [P in keyof T]?: T[P]|IDynamicFormItemCallback<T[P]> }

/**
 * 表单事件中心消息名称
 */
/**
 * 重新加载表单项目。由条目自由处理。
 */
export const MESSAGE_RELOAD = 'reload';
/**
 * 切换到下一个 Tab 页
 */
export const MESSAGE_TAB_NEXT = 'tab-next';
/**
 * 切换到上一个 Tab 页
 */
export const MESSAGE_TAB_PREV = 'tab-prev';
/**
 * 设置当前 Tab 页
 * * 参数：string 目标 Tab 页的 key
 */
export const MESSAGE_TAB_ACTIVE = 'tab-active';

export interface IDynamicFormItem {
  /**
   * 当前表单类型
   */
  type: string;
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
   */
  disabled?: boolean|IDynamicFormItemCallback<boolean>;
  /**
   * 附加组件属性。支持动态回调(只支持第一级传入回调)。
   */
  additionalProps?: Record<string, unknown|IDynamicFormItemCallback<unknown>>|unknown;
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  additionalEvents?: Record<string, Function>;
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
  rules?: any[];

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
  formProps?: unknown;
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
  children?: IDynamicFormItem[];
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
  childrenFormProps?: unknown,
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

export const defaultDynamicFormInternalWidgets = {
  Form: {
    component: markRaw(Form),
    propsMap: {},
  },
  FormItem: {
    component: markRaw(FormItem),
    propsMap: {},
  }
} as IDynamicFormInternalWidgets
export interface IDynamicFormInternalWidgets {
  Form?: {
    /**
     * 组件实例
     */
    component: unknown,
    /**
     * 属性的名称修改
     */
    propsMap: {
      rules?: string,
      model?: string,
      labelCol?: string,
      labelWidth?: string,
      wrapperCol?: string,
      onFinish?: string,
      onFinishFailed?: string,
      onSubmit?: string,
      submit?: string,
      validate?: string,
    },
  },
  FormItem?: {
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
      labelCol?: string,
      wrapperCol?: string,
      rules?: string,
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

// DynamicForm 实例方法接口
export interface IDynamicFormRef {
  /**
   * 获取表单组件的 Ref
   * @returns 
   */
  getFormRef: <T>() => T;
  /**
   * 获取指定表单项组件的 Ref
   * @returns 
   */
  getFormItemControlRef: <T>(key: string) => T;
  /**
   * 触发提交。同 getFormRef().submit() 。
   * @returns 
   */
  submit: () => void;
  /**
   * 验证当前表单数据是否有效。同 getFormRef().validate() 。
   * @returns 
   */
  validate: () => Promise<void>;
  /**
   * 外部修改指定单个 field 的数据
   * @param path 路径
   * @param value 值
   * @returns 
   */
  setValueByPath: (path: string|string[], value: unknown) => void,
  /**
   * 外部获取指定单个 field 的数据
   * @param path 路径
   * @returns 
   */
  getValueByPath: (path: string|string[]) => unknown,
  /**
   * 向所有或者指定的子组件分发消息事件。
   * @param messageName 消息名称。
   * @param data 可选参数。
   * @param receiveFilter 可选名称筛选正则，此正则通过名称的子组件会接受事件，其他则不会。
   * @returns 
   */
  dispatchMessage: (messageName: string, data?: unknown, receiveFilter?: RegExp) => void;
  /**
   * 向所有子组件分发重新加载消息事件。
   * @returns 
   */
  dispatchReload: () => void;
  /**
   * 获取当前表单中可见的所有字段名
   */
  getVisibleFormNames: () => string[];
  /**
   * 初始化表单默认值到模型中，对于已有数据非空的字段，不会覆盖已有的值。
   * @returns 
   */
  initDefaultValuesToModel: () => void;
}
export interface IDynamicFormOptions {
  /**
   * 表单条目数据
   */
  formItems: IDynamicFormItem[];
  /**
   * 表单的校验规则
   */
  formRules?: Record<string, unknown>;
  /**
   * 表单label栅格宽度。如果使用自定义Form，请同时设置属性名映射。
   */
  formLabelCol?: ColProps|string|number,
  /**
   * 表单组件栅格宽度。如果使用自定义Form，请同时设置属性名映射。
   */
  formWrapperCol?: ColProps|string|number,
  /**
   * 表单label宽度。部分UI库的Form组件可能不支持这个属性。
   */
  formLabelWidth?: number|string,
  /**
   * 表单组件附加属性
   */
  formAdditionaProps?: Record<string, unknown>;
  /**
   * 表单组件附加事件绑定
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  formAdditionalEvents?: Record<string, Function>;
  /**
   * 表单嵌套名称生成类型。默认是 dot 。
   * 该选项用于生成嵌套表单对象的名称，例如 `a.b.c` 或者 `['a','b','c']` ，
   * 用于适配不同的UI库组件的name定义（例如 ant-design-vue 的 FormItem 组件，表单验证时需要使用数组格式‘array’）。
   * @default 'dot'
   */
  formNestNameGenerateType?: DynamicFormNestNameGenerateType,

  /**
   * 自定义重写表单控件。你可以重写内置控件，在这个表单中会以此重写列表为先查找表单组件。
   */
  widgets?: Record<string, DynamicFormItemRegistryItem>,
  /**
   * 自定义重写内置表单控件 Form FormItem。你可以使用其他组件库的组件例如 elemnent-ui 或者 ant-desgin-vue
   */
  internalWidgets?: IDynamicFormInternalWidgets,
  /**
   * 表单是否禁用。默认否
   * @default false
   */
  disabled?: boolean,
  /**
   * 当表单中无可用编辑条目时，显示的提示，为空则不显示提示。默认为空
   * @default ''
   */
  emptyText?: string,
  /**
   * 是否屏蔽顶层对象错误。默认否
   * @default false
   */
  suppressRootError?: boolean,
  /**
   * 是否屏蔽所有子条目空错误。默认否
   * @default false
   */
  suppressEmptyError?: boolean,
  /**
   * 当显示嵌套的表单对象条目时是否在前部显示缩进，
   * 缩进大小可使用 CSS 变量 `--dynamic-form-item-nest-margin` 自定义。默认是 20px
   * @default true
   */
  nestObjectMargin?: boolean,
}

// 动态表单属性接口

/**
 * 默认的动态表单属性
 */
export let defaultDynamicFormOptions = {} as IDynamicFormOptions;

/**
 * 配置默认的动态表单属性，配置后将会对所有动态表单生效。
 * @param options 参数
 */
export function configDefaultDynamicFormOptions(options: Omit<IDynamicFormOptions, 'formItems'>) {
  defaultDynamicFormOptions = {
    ...defaultDynamicFormOptions,
    ...options,
  };
}

export interface FormCustomLayoutProps {
  render: (item: IDynamicFormItem, defaultSlot: Slot) => VNode[];
}
export interface IDynamicFormTabProps {
  defaultActiveKey?: string,
  tabProps?: any,
  renderTab?: (item: IDynamicFormItem, props: {
    activeKey: string,
    defaultActiveKey: string|undefined,
    'onUpdate:activeKey': (newValue: string) => void,
  }, defaultSlot: Slot) => VNode[];
}
export interface IDynamicFormTabPageProps {
  renderTabPage?: (item: IDynamicFormItem, props: {
    key: string,
    title: string,
  }, defaultSlot: Slot) => VNode[];
}

export function renderTextDefaultSlot(text: string) {
  return {
    default: () => [ h('span', text) ],
  }
} 

export type IEvaluateCallback = <T>(val: T | IDynamicFormItemCallback<T>) => T;
export type IDynamicFormMessageCenterCallback = (messageName: string, data: unknown) => void;

export interface IDynamicFormMessageCenter {
  addInstance: (name: string, fn: IDynamicFormMessageCenterCallback) => void,
  removeInstance: (name: string) => void,
}
