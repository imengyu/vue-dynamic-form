import type { Rule } from 'async-validator';
import { Form, FormItem, type FormItemProps, type FormProps, type NextTabButtonProps } from "../DynamicFormBasicControls";
import { markRaw } from "vue";
import type { BaseCheckProps, BaseDividerProps, BaseInputProps, BaseRadioProps, BaseSelectProps, BaseTextAreaProps, FormArrayGroupProps, FormGroupProps } from "../DynamicFormItemControls";
import type { BaseButtonProps } from "../DynamicFormItemControls/BaseButton";
import type { FormCustomLayoutProps } from '../DynamicFormItemControls/FormCustomLayout.vue';
import type { IDynamicFormTabProps } from '../DynamicFormTab/DynamicFormTab.vue';
import type { IDynamicFormTabPageProps } from '../DynamicFormTab/DynamicFormTabPage.vue';

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

//默认的表单项类型
export interface IDynamicFormWidgetPropsMap {
  'base-textarea': BaseTextAreaProps;
  'base-text': BaseInputProps;
  'base-select': BaseSelectProps;
  'base-check': BaseCheckProps;
  'base-radio': BaseRadioProps;
  'base-divider': BaseDividerProps;
  'base-next-tab-button': NextTabButtonProps;
  'base-button': BaseButtonProps;
  'object': {};
  'object-group': FormGroupProps;
  'flat-group': FormGroupProps;
  'flat-custom': FormCustomLayoutProps;
  'flat-simple': {};
  'tab-custom': IDynamicFormTabProps;
  'tab-page-custom': IDynamicFormTabPageProps;
  'array-single': FormArrayGroupProps;
  'array-object': FormArrayGroupProps;

};
//表单组件属性映射
//
export interface IDynamicFormPropsMap {
  Form: FormProps;
  FormItem: FormItemProps;
  FormEvents: Record<string, Function>;
  Rules: Record<string, Rule>;
  ItemRules: Rule[];
  ItemEvents: Record<string, Function>;
}