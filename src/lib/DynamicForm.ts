import { ColProps } from "./DynamicFormBasicControls/Layout/Col";
import { DynamicFormItemRegistryItem } from "./DynamicFormItemRenderer/DynamicFormItemRegistry";
import { Rule } from 'async-validator';

export type IDynamicFormObject = Record<string, unknown>;
/**
 * @param model 当前表单条目的值
 * @param rawModel 整个 form 的值 （最常用，当两个关联组件距离较远时，可以从顶层的 rawModel 里获取）
 * @param parentModel 父表单元素的值 （上一级的值，只在列表场景的使用，例如列表某个元素的父级就是整个 item）
 * @param item 当前表单条目信息
 * @param formRules 当前条目校验数据
 */
export type IDynamicFormItemCallback<T> = (model: unknown, rawModel: unknown, parentModel: unknown, item: IDynamicFormItem, formRules?: Record<string, Rule>) => T;

export type IDynamicFormItemCallbackAdditionalProps<T> = { [P in keyof T]?: T[P]|IDynamicFormItemCallback<T[P]> }

export interface IDynamicFormItem {
  /**
   * 当前表单类型
   */
  type: string;
  /**
   * 显示当前条目的附加条件，不传默认显示
   */
  showCondition?: IDynamicFormItemCallback<boolean>;
  /**
   * 是否禁用当前表单项
   */
  disabled?: boolean|IDynamicFormItemCallback<boolean>;
  /**
   * 附加组件属性。支持动态回调(只支持第一级传入回调)。当传入值是函数时，请使用 additionalDirectProps。
   */
  additionalProps?: Record<string, unknown|IDynamicFormItemCallback<unknown>>|unknown;
  /**
   * 附加组件事件绑定
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  additionalEvents?: Record<string, Function>;
  /**
   * 附加组件属性。此属性直接应用到目标渲染组件上
   */
  additionalDirectProps?: Record<string, unknown>;
  /**
   * 附加FormItem组件属性
   */
  formProps?: Record<string, unknown>;
  /**
   * 当前表单名称
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
   * 条目的 Col 配置属性(应用到当前条目上)。仅在 object 或者其他容器条目中有效。
   */
  colProps?: ColProps,
}

//DynamicForm 实例方法接口
export interface IDynamicFormRef {
  /**
   * 获取表单组件的 Ref
   * @returns 
   */
  getFormRef: <T>() => T;
  /**
   * 获取表单组件的 Ref
   * @returns 
   */
  getFormItemControlRef: <T>(key: string) => T;
  /**
   * 触发提交。同 getFormRef().submit() 。
   * @returns 
   */
  submit: () => void;
  /**
   * 外部手动修改 formData，用于已填写的表单的数据回填
   * @param formData 
   * @returns 
   */
  setValues: (formData: IDynamicFormObject) => void,
  /**
   * 外部修改指定单个 field 的数据
   * @param formData 
   * @returns 
   */
  setValueByPath: (formData: Record<string, unknown>) => void,
  /**
   * 指定路径修改 formItem
   * @param formData 
   * @returns 
   */
  setSchemaByPath: (formData: Record<string, IDynamicFormItem>) => void,
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
  formRules?: Record<string, Rule>;
  /**
   * 表单label栅格宽度
   */
  formLabelCol?: { span: number, offset?: number },
  /**
   * 表单label宽度
   */
  formLabelWidth?: number|string,
  /**
   * 表单组件栅格宽度
   */
  formWrapperCol?: { span: number, offset?: number },
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
   * 自定义重写内置表单控件例如 Col、Row、Form等等。你可以使用其他组件库的组件例如 elemnent-ui 或者 ant-desgin-vue
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
 * 配置默认的动态表单属性
 * @param options 
 */
export function configDefaultDynamicFormOptions(options: IDynamicFormOptions) {
  defaultDynamicFormOptions = {
    ...defaultDynamicFormOptions,
    ...options,
  };
}