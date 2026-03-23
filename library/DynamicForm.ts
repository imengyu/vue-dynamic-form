import { h } from "vue";
import type { IDynamicFormItem } from "./DynamicFormDefs/DynamicFormItem";
import type { IDynamicFormItemCallback } from "./DynamicFormDefs/DynamicFormItem";
import type { IDynamicFormOptions } from "./DynamicFormDefs/DynamicFormOptions";
import type { IDynamicFormEditorContext } from "./DynamicFormItemEditor/DynamicFormItemEditor";

// 动态表单属性接口

export interface IDynamicFormProps<T = IDynamicFormOptions> {
  /**
   * 动态表单选项
   */
  options: T;
  /**
   * 表单数据模型
   */
  model?: IDynamicFormObject;
  /**
   * 表单名称, 设置到表单组件上。
   */
  name?: string;
  /**
   * 全局参数。用于向每个表单项的参数中添加额外的参数，可以在回调中的 formGlobalParams 中访问。
   */
  globalParams?: IDynamicFormObject;
  /**
   * 编辑模式。用于在编辑模式下，表单控件会显示为可编辑状态。
   */
  editorContext?: IDynamicFormEditorContext;
}

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

export type IDynamicFormObject = Record<string, unknown>;

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