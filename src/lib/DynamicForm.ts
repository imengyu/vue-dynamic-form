import { ColProps } from "./DynamicFormBasicControls/Layout/Col";
import { DynamicFormItemRegistryItem } from "./DynamicFormItemRenderer/DynamicFormItemRegistry";
import { Rule } from 'async-validator';
import { RowProps } from "./DynamicFormBasicControls";
import { Slot } from "vue";

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
   * @param item 当前表单条目信息
   * @param formRules 当前条目校验数据
   */
  callback: (model: unknown, rawModel: unknown, parentModel: unknown, item: IDynamicFormItem, formRules?: Record<string, Rule>) => T;
}

export type IDynamicFormItemCallbackAdditionalProps<T> = { [P in keyof T]?: T[P]|IDynamicFormItemCallback<T[P]> }

export const MESSAGE_RELOAD = 'reload';

export interface IDynamicFormItem {
  /**
   * 当前表单类型
   */
  type: string;
  /**
   * 是否隐藏当前表单项
   */
  hidden?: boolean|IDynamicFormItemCallback<boolean>;
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
   */
  additionalSlot?: Record<string, Slot>;
  /**
   * 附加组件事件绑定
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  additionalEvents?: Record<string, Function>;
  /**
   * 附加组件属性。此属性直接应用到目标渲染组件上，没有联动回调。
   */
  additionalDirectProps?: unknown;
  /**
   * 加载时的钩子函数
   * @param nowValue 当前组件的实例
   * @param getComponentRef 当前组件的实例
   * @returns 
   */
  mounted?: (nowValue: unknown, getComponentRef: () => unknown) => void;
  /**
   * 当前表单组件卸载之前的钩子函数
   * @param componentRef 当前组件的实例
   * @returns 
   */
  beforeUnmount?: (componentRef: () => unknown) => void;
  /**
   * 监听当前表单项数据更改
   * @param oldValue 旧数据
   * @param newValue 新数据
   * @param getComponentRef 当前组件的实例
   * @returns 
   */
  watch?: (oldValue: unknown, newValue: unknown, getComponentRef: () => unknown) => void,
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
  formLabelCol?: { span: number, offset?: number },
  /**
   * 表单组件栅格宽度。如果使用自定义Form，请同时设置属性名映射。
   */
  formWrapperCol?: { span: number, offset?: number },
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
   * 当前条目的 Col 配置属性(应用到当前条目上)。仅在 object 或者其他容器条目中有效。
   */
  colProps?: ColProps,
  /**
   * 当前条目的 Row 配置属性(应用到当前条目上)。仅在 object 或者其他容器条目中有效。
   */
  rowProps?: RowProps,
}

//DynamicForm 实例方法接口
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
   * 外部修改指定单个 field 的数据
   * @param path 路径
   * @param value 值
   * @returns 
   */
  setValueByPath: (path: string, value: unknown) => void,
  /**
   * 外部获取指定单个 field 的数据
   * @param path 路径
   * @returns 
   */
  getValueByPath: (path: string) => unknown,
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
}

export interface IDynamicFormInternalWidgets {
  Form: {
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
      labelCol?: string,
      wrapperCol?: string,
    },
  },
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
  formLabelCol?: { span: number, offset?: number },
  /**
   * 表单组件栅格宽度。如果使用自定义Form，请同时设置属性名映射。
   */
  formWrapperCol?: { span: number, offset?: number },
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
   * 自定义重写表单控件。你可以重写内置控件，在这个表单中会以此重写列表为先查找表单组件。
   */
  widgets?: Record<string, DynamicFormItemRegistryItem>,
  /**
   * 自定义重写内置表单控件 Form FormItem。你可以使用其他组件库的组件例如 elemnent-ui 或者 ant-desgin-vue
   */
  internalWidgets?: IDynamicFormInternalWidgets,
  /**
   * 表单是否禁用。默认否
   */
  disabled?: boolean,
}

/**
 * 默认的动态表单属性
 */
export let defaultDynamicFormOptions = {} as IDynamicFormOptions;

/**
 * 配置默认的动态表单属性，配置后将会对所有动态表单生效。
 * @param options 参数
 */
export function configDefaultDynamicFormOptions(options: IDynamicFormOptions) {
  defaultDynamicFormOptions = {
    ...defaultDynamicFormOptions,
    ...options,
  };
}