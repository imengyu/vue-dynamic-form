import type { ColProps } from "../DynamicFormBasicControls/Layout/Col.vue";
import type { IDynamicFormItemUnion } from "./DynamicFormItem";
import type { DynamicFormItemRegistryItem } from "../DynamicFormItemRenderer/DynamicFormItemRegistry";
import type { IDynamicFormInternalWidgets, IDynamicFormPropsMap } from "./DynamicFormWidgets";

export type DynamicFormNestNameGenerateType = 'dot'|'array'


// DynamicForm 实例方法接口
export interface IDynamicFormRef {
  /**
   * 获取表单组件的 Ref
   * @returns 
   */
  getFormRef: <T>() => T|undefined;
  /**
   * 获取指定表单项组件的 Ref
   * @returns 
   */
  getFormItemControlRef: <T>(key: string) => T|undefined;
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
export interface IDynamicFormOptions<
  T = IDynamicFormItemUnion[],
  P extends IDynamicFormPropsMap = IDynamicFormPropsMap,
> {
  /**
   * 表单条目数据
   */
  formItems: T;
  /**
   * 表单的校验规则
   */
  formRules?: P['Rules'];
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
  formAdditionaProps?: P['Form'];
  /**
   * 表单组件附加事件绑定
   */
  formAdditionalEvents?: P['FormEvents'];
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
   * 是否屏蔽所有子条目空错误。默认是。屏蔽所有子条目空错误后当遇到空值，会尝试使用默认值填充。
   * @default true
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
export let defaultDynamicFormOptions = {
  suppressEmptyError: true,
} as IDynamicFormOptions;

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

/**
 * 定义表单选项的工具函数。
 * @param options 表单选项
 * @returns 
 */
export function defineDynamicFormOptions<
  const T extends IDynamicFormItemUnion[],
  P extends IDynamicFormPropsMap = IDynamicFormPropsMap,
>(options: Omit<IDynamicFormOptions<T, P>, 'formItems'> & { formItems: T }) {
  return options;
}